"""Base agent class — all agents inherit from this."""
from __future__ import annotations

import json
import logging
import re
from abc import ABC, abstractmethod
from typing import Any

from openai import AsyncOpenAI

from app.config import settings

logger = logging.getLogger(__name__)


def brand_name_from_idea(business_idea: str) -> str:
    """Derive a short brand name from the business idea."""
    words = re.findall(r"[A-Za-z]{3,}", business_idea)
    if not words:
        return "Venturely"
    if len(words) == 1:
        w = words[0]
        return w[:1].upper() + w[1:8].lower()
    return "".join(w[:1].upper() + w[1:4].lower() for w in words[:2])


class BaseAgent(ABC):
    """Abstract base for all business builder agents."""

    name: str = "base"

    def __init__(self) -> None:
        if not settings.use_mock:
            self._client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        else:
            self._client = None

    async def run(
        self,
        business_idea: str,
        target_market: str,
        country: str,
        budget: str,
        prior_results: dict[str, Any] | None = None,
    ) -> dict[str, Any]:
        """Run this agent and return structured JSON output."""
        ctx = prior_results or {}
        if settings.use_mock:
            logger.info("[%s] Using mock data", self.name)
            return self._mock_output(business_idea, target_market, country, budget, ctx)

        try:
            return await self._call_openai(
                business_idea, target_market, country, budget, ctx
            )
        except Exception as exc:
            logger.error("[%s] OpenAI call failed: %s. Falling back to mock.", self.name, exc)
            return self._mock_output(business_idea, target_market, country, budget, ctx)

    @abstractmethod
    def _system_prompt(self) -> str:
        pass

    @abstractmethod
    def _user_prompt(
        self,
        business_idea: str,
        target_market: str,
        country: str,
        budget: str,
        prior_results: dict[str, Any],
    ) -> str:
        pass

    @abstractmethod
    def _mock_output(
        self,
        business_idea: str,
        target_market: str,
        country: str,
        budget: str,
        prior_results: dict[str, Any],
    ) -> dict[str, Any]:
        pass

    async def _call_openai(
        self,
        business_idea: str,
        target_market: str,
        country: str,
        budget: str,
        prior_results: dict[str, Any],
    ) -> dict[str, Any]:
        prompt = self._user_prompt(business_idea, target_market, country, budget, prior_results)

        response = await self._client.chat.completions.create(
            model=settings.OPENAI_MODEL,
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": self._system_prompt()},
                {"role": "user", "content": prompt},
            ],
            temperature=0.7,
        )

        content = response.choices[0].message.content
        return json.loads(content)
