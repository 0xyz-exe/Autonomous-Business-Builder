from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.models import AgentResult, BusinessProject
from app.schemas import AgentResultResponse

router = APIRouter(prefix="/results", tags=["results"])


@router.get("/{project_id}", response_model=list[AgentResultResponse])
async def get_results(
    project_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Get all agent results for a project."""
    # Verify project exists
    proj = await db.execute(
        select(BusinessProject).where(BusinessProject.id == project_id)
    )
    if not proj.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Project not found")

    result = await db.execute(
        select(AgentResult)
        .where(AgentResult.project_id == project_id)
        .order_by(AgentResult.created_at)
    )
    return result.scalars().all()
