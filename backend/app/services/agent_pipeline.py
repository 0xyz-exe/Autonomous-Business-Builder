"""Agent pipeline orchestration."""
from __future__ import annotations

import logging
from typing import Any

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.agent_outputs import validate_agent_output
from app.agents.analytics_agent import AnalyticsAgent
from app.agents.branding_agent import BrandingAgent
from app.agents.content_agent import ContentAgent
from app.agents.market_agent import MarketResearchAgent
from app.agents.sales_agent import SalesAgent
from app.database import AsyncSessionLocal
from app.models import AgentName, AgentResult, BusinessProject, ProjectStatus

logger = logging.getLogger(__name__)

AGENT_PIPELINE: list[tuple[AgentName, type]] = [
    (AgentName.market, MarketResearchAgent),
    (AgentName.branding, BrandingAgent),
    (AgentName.content, ContentAgent),
    (AgentName.sales, SalesAgent),
    (AgentName.analytics, AnalyticsAgent),
]


def recompute_project_status(results: list[AgentResult]) -> ProjectStatus:
    """Derive project status from stored agent results."""
    if not results:
        return ProjectStatus.pending
    names = {r.agent_name for r in results}
    has_error = any("error" in (r.result_json or {}) for r in results)
    expected = {
        AgentName.market,
        AgentName.branding,
        AgentName.content,
        AgentName.sales,
        AgentName.analytics,
    }
    all_five = expected.issubset(names)
    if has_error:
        return ProjectStatus.failed
    if all_five:
        return ProjectStatus.completed
    return ProjectStatus.running


async def run_agent_pipeline(project_id: str) -> None:
    """Run all agents sequentially and persist validated results."""
    async with AsyncSessionLocal() as db:
        try:
            result = await db.execute(
                select(BusinessProject).where(BusinessProject.id == project_id)
            )
            project = result.scalar_one_or_none()
            if not project:
                logger.error("Project %s not found for pipeline", project_id)
                return

            project.status = ProjectStatus.running
            await db.commit()

            prior_results: dict[str, Any] = {}
            pipeline_had_error = False

            for agent_name, AgentClass in AGENT_PIPELINE:
                logger.info("Running agent %s for project %s", agent_name.value, project_id)
                agent = AgentClass()
                try:
                    raw = await agent.run(
                        business_idea=project.business_idea,
                        target_market=project.target_market,
                        country=project.country,
                        budget=project.budget,
                        prior_results=prior_results,
                    )
                    output = validate_agent_output(agent_name.value, raw)
                    if "error" not in output:
                        prior_results[agent_name.value] = output
                except Exception as exc:
                    logger.error("Agent %s failed: %s", agent_name.value, exc)
                    pipeline_had_error = True
                    output = {"error": str(exc), "status": "failed"}

                db.add(
                    AgentResult(
                        project_id=project_id,
                        agent_name=agent_name,
                        result_json=output,
                    )
                )
                await db.commit()
                if "error" in output:
                    pipeline_had_error = True

            project.status = (
                ProjectStatus.failed if pipeline_had_error else ProjectStatus.completed
            )
            await db.commit()
            logger.info("Pipeline finished for %s: %s", project_id, project.status.value)

        except Exception as exc:
            logger.error("Pipeline failed for project %s: %s", project_id, exc)
            try:
                result = await db.execute(
                    select(BusinessProject).where(BusinessProject.id == project_id)
                )
                project = result.scalar_one_or_none()
                if project:
                    project.status = ProjectStatus.failed
                    await db.commit()
            except Exception:
                pass


async def load_prior_results(db: AsyncSession, project_id: str, exclude: str) -> dict[str, Any]:
    """Load successful prior agent outputs for context."""
    result = await db.execute(
        select(AgentResult).where(AgentResult.project_id == project_id)
    )
    prior: dict[str, Any] = {}
    for row in result.scalars().all():
        if row.agent_name.value != exclude and "error" not in (row.result_json or {}):
            prior[row.agent_name.value] = row.result_json
    return prior
