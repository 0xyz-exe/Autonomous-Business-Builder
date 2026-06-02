import logging

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models import BusinessProject, ProjectStatus
from app.schemas import CreateProjectRequest, ProjectResponse, ProjectSummaryResponse
from app.services.agent_pipeline import run_agent_pipeline

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/projects", tags=["projects"])


@router.post("", response_model=ProjectSummaryResponse, status_code=202)
async def create_project(
    payload: CreateProjectRequest,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
):
    """Create a new business project and kick off the agent pipeline."""
    project = BusinessProject(
        business_idea=payload.business_idea,
        target_market=payload.target_market,
        country=payload.country,
        budget=payload.budget,
        status=ProjectStatus.pending,
    )
    db.add(project)
    await db.commit()
    await db.refresh(project)

    background_tasks.add_task(run_agent_pipeline, project.id)

    return project


@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(
    project_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Get a project with all its agent results."""
    result = await db.execute(
        select(BusinessProject)
        .options(selectinload(BusinessProject.results))
        .where(BusinessProject.id == project_id)
    )
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.get("", response_model=list[ProjectSummaryResponse])
async def list_projects(db: AsyncSession = Depends(get_db)):
    """List all projects (most recent first)."""
    result = await db.execute(
        select(BusinessProject).order_by(BusinessProject.created_at.desc()).limit(50)
    )
    return result.scalars().all()
