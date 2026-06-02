import logging

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.agent_outputs import validate_agent_output
from app.agents.analytics_agent import AnalyticsAgent
from app.agents.branding_agent import BrandingAgent
from app.agents.content_agent import ContentAgent
from app.agents.market_agent import MarketResearchAgent
from app.agents.sales_agent import SalesAgent
from app.database import get_db
from app.models import AgentName, AgentResult, BusinessProject, ProjectStatus
from app.schemas import RunAgentRequest, RunAgentResponse
from app.services.agent_pipeline import load_prior_results, recompute_project_status

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/agents", tags=["agents"])

AGENT_MAP = {
    "market": MarketResearchAgent,
    "branding": BrandingAgent,
    "content": ContentAgent,
    "sales": SalesAgent,
    "analytics": AnalyticsAgent,
}


@router.post("/run", response_model=RunAgentResponse)
async def run_single_agent(
    payload: RunAgentRequest,
    db: AsyncSession = Depends(get_db),
):
    """Run a single agent for a project (retry or on-demand)."""
    if payload.agent_name not in AGENT_MAP:
        raise HTTPException(
            status_code=400,
            detail=f"Unknown agent: {payload.agent_name}. Valid agents: {list(AGENT_MAP.keys())}",
        )

    result = await db.execute(
        select(BusinessProject)
        .options(selectinload(BusinessProject.results))
        .where(BusinessProject.id == payload.project_id)
    )
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    prior_results = await load_prior_results(db, payload.project_id, payload.agent_name)

    AgentClass = AGENT_MAP[payload.agent_name]
    agent = AgentClass()

    try:
        raw = await agent.run(
            business_idea=project.business_idea,
            target_market=project.target_market,
            country=project.country,
            budget=project.budget,
            prior_results=prior_results,
        )
        output = validate_agent_output(payload.agent_name, raw)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Agent run failed: {str(e)}") from e

    existing = await db.execute(
        select(AgentResult).where(
            AgentResult.project_id == payload.project_id,
            AgentResult.agent_name == AgentName[payload.agent_name],
        )
    )
    agent_result = existing.scalar_one_or_none()
    if agent_result:
        agent_result.result_json = output
    else:
        db.add(
            AgentResult(
                project_id=payload.project_id,
                agent_name=AgentName[payload.agent_name],
                result_json=output,
            )
        )

    await db.commit()

    refreshed = await db.execute(
        select(BusinessProject)
        .options(selectinload(BusinessProject.results))
        .where(BusinessProject.id == payload.project_id)
    )
    project = refreshed.scalar_one()
    project.status = recompute_project_status(list(project.results))
    await db.commit()

    return RunAgentResponse(
        success="error" not in output,
        agent_name=payload.agent_name,
        project_id=payload.project_id,
        message=(
            f"Agent '{payload.agent_name}' completed successfully"
            if "error" not in output
            else f"Agent '{payload.agent_name}' returned an error"
        ),
    )
