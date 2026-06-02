"""Pydantic schemas for agent JSON outputs."""
from typing import Any

from pydantic import BaseModel, ConfigDict, Field


class MarketOutput(BaseModel):
    model_config = ConfigDict(extra="allow")

    market_opportunity: dict[str, Any]
    competitors: list[dict[str, Any]] = Field(default_factory=list)
    customer_personas: list[dict[str, Any]] = Field(default_factory=list)
    swot: dict[str, Any]
    entry_barriers: list[str] = Field(default_factory=list)
    regulatory_notes: str = ""


class BrandingOutput(BaseModel):
    model_config = ConfigDict(extra="allow")

    brand_name: str
    tagline: str
    unique_value_proposition: str = ""
    brand_colors: dict[str, Any] = Field(default_factory=dict)
    brand_name_alternatives: list[str] = Field(default_factory=list)
    brand_voice: str = ""
    positioning_statement: str = ""
    brand_personality: list[str] = Field(default_factory=list)
    elevator_pitch: str = ""


class ContentOutput(BaseModel):
    model_config = ConfigDict(extra="allow")

    website_copy: dict[str, Any]
    social_media: dict[str, Any] = Field(default_factory=dict)
    email_templates: list[dict[str, Any]] = Field(default_factory=list)
    ad_copies: list[dict[str, Any]] = Field(default_factory=list)


class SalesOutput(BaseModel):
    model_config = ConfigDict(extra="allow")

    pricing_strategy: dict[str, Any]


class AnalyticsOutput(BaseModel):
    model_config = ConfigDict(extra="allow")

    kpis: list[dict[str, Any]] = Field(default_factory=list)
    roadmap_90_days: list[dict[str, Any]] = Field(default_factory=list)


OUTPUT_MODELS: dict[str, type[BaseModel]] = {
    "market": MarketOutput,
    "branding": BrandingOutput,
    "content": ContentOutput,
    "sales": SalesOutput,
    "analytics": AnalyticsOutput,
}


def validate_agent_output(agent_name: str, data: dict[str, Any]) -> dict[str, Any]:
    """Validate and normalize agent JSON before persistence."""
    if "error" in data:
        return data
    model = OUTPUT_MODELS.get(agent_name)
    if not model:
        return data
    return model.model_validate(data).model_dump()
