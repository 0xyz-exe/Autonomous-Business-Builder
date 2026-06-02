from __future__ import annotations
from typing import Any
from app.agents.base_agent import BaseAgent, brand_name_from_idea


class BrandingAgent(BaseAgent):
    name = "branding"

    def _system_prompt(self) -> str:
        return (
            "You are a world-class brand strategist and creative director. "
            "You create memorable, market-aligned brand identities for startups. "
            "Always respond with valid JSON matching the exact structure requested."
        )

    def _user_prompt(
        self,
        business_idea: str,
        target_market: str,
        country: str,
        budget: str,
        prior_results: dict[str, Any],
    ) -> str:
        market_context = ""
        if prior_results.get("market"):
            m = prior_results["market"]
            personas = m.get("customer_personas", [])
            if personas:
                market_context = f"\nTarget Persona: {personas[0].get('name', '')}"

        return f"""Create a complete brand identity for this business and return JSON:

Business Idea: {business_idea}
Target Market: {target_market}
Country: {country}{market_context}

Return JSON with this exact structure:
{{
  "brand_name": "string",
  "brand_name_alternatives": ["name1", "name2"],
  "tagline": "string",
  "brand_voice": "string",
  "positioning_statement": "string",
  "unique_value_proposition": "string",
  "brand_colors": {{
    "primary": "#hexcode",
    "secondary": "#hexcode",
    "accent": "#hexcode",
    "rationale": "string"
  }},
  "brand_personality": ["trait1", "trait2", "trait3"],
  "elevator_pitch": "string"
}}"""

    def _mock_output(
        self,
        business_idea: str,
        target_market: str,
        country: str,
        budget: str,
        prior_results: dict[str, Any],
    ) -> dict[str, Any]:
        brand = brand_name_from_idea(business_idea)
        return {
            "brand_name": brand,
            "brand_name_alternatives": ["Launchly", "VentureAI", "Buildify"],
            "tagline": "From Idea to Empire, Instantly.",
            "brand_voice": "Confident, innovative, and empowering. Speaks directly to ambitious founders "
                           "who want to move fast without sacrificing quality.",
            "positioning_statement": f"For {target_market} who want to launch and grow their business "
                                     f"in {country}, {brand} is the AI-powered business builder that "
                                     "transforms raw ideas into actionable business strategies in minutes, "
                                     "unlike traditional consultants who take weeks and cost thousands.",
            "unique_value_proposition": "The only platform that uses specialized AI agents to deliver a "
                                        "complete business package — market research, branding, content, "
                                        "sales strategy, and analytics — in one seamless workflow.",
            "brand_colors": {
                "primary": "#6C63FF",
                "secondary": "#1A1A2E",
                "accent": "#00D4AA",
                "rationale": "Purple conveys innovation and creativity; dark navy provides sophistication "
                             "and trustworthiness; teal accent signals growth and forward-thinking.",
            },
            "brand_personality": [
                "Innovative",
                "Empowering",
                "Trustworthy",
                "Ambitious",
                "Clear",
            ],
            "elevator_pitch": f"{brand} is an AI-powered business builder that transforms your business idea "
                              "into a complete business package in minutes. Our five specialized AI agents "
                              "handle market research, branding, content creation, sales strategy, and "
                              "analytics — so you can focus on building, not planning.",
        }
