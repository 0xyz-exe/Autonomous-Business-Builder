from datetime import datetime
from typing import Any
from pydantic import BaseModel, Field, ConfigDict


# ─── Request Schemas ──────────────────────────────────────────────────────────

class CreateProjectRequest(BaseModel):
    business_idea: str = Field(..., min_length=10, max_length=2000)
    target_market: str = Field(..., min_length=2, max_length=255)
    country: str = Field(..., min_length=2, max_length=100)
    budget: str = Field(..., min_length=1, max_length=100)


class RunAgentRequest(BaseModel):
    project_id: str
    agent_name: str


# ─── Response Schemas ─────────────────────────────────────────────────────────

class AgentResultResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    project_id: str
    agent_name: str
    result_json: dict[str, Any]
    created_at: datetime


class ProjectResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    business_idea: str
    target_market: str
    country: str
    budget: str
    status: str
    created_at: datetime
    results: list[AgentResultResponse] = []


class ProjectSummaryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    business_idea: str
    target_market: str
    country: str
    budget: str
    status: str
    created_at: datetime


class RunAgentResponse(BaseModel):
    success: bool
    agent_name: str
    project_id: str
    message: str


class ErrorResponse(BaseModel):
    detail: str
