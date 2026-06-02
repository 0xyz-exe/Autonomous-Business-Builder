from __future__ import annotations
from typing import Any
from app.agents.base_agent import BaseAgent


class MarketResearchAgent(BaseAgent):
    name = "market"

    def _system_prompt(self) -> str:
        return (
            "You are an expert market research analyst with 20 years of experience. "
            "Analyze business opportunities with data-driven insights. "
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
        return f"""Analyze this business opportunity and return a JSON object with exactly this structure:

Business Idea: {business_idea}
Target Market: {target_market}
Country: {country}
Budget: {budget}

Return JSON with this exact structure:
{{
  "market_opportunity": {{
    "summary": "string",
    "market_size": "string",
    "growth_rate": "string",
    "key_trends": ["trend1", "trend2", "trend3"]
  }},
  "competitors": [
    {{
      "name": "string",
      "description": "string",
      "strengths": ["s1", "s2"],
      "weaknesses": ["w1", "w2"],
      "market_share": "string"
    }}
  ],
  "customer_personas": [
    {{
      "name": "string",
      "age_range": "string",
      "occupation": "string",
      "pain_points": ["p1", "p2"],
      "goals": ["g1", "g2"],
      "preferred_channels": ["c1", "c2"]
    }}
  ],
  "swot": {{
    "strengths": ["s1", "s2", "s3"],
    "weaknesses": ["w1", "w2", "w3"],
    "opportunities": ["o1", "o2", "o3"],
    "threats": ["t1", "t2", "t3"]
  }},
  "entry_barriers": ["b1", "b2"],
  "regulatory_notes": "string"
}}"""

    def _mock_output(
        self,
        business_idea: str,
        target_market: str,
        country: str,
        budget: str,
        prior_results: dict[str, Any],
    ) -> dict[str, Any]:
        return {
            "market_opportunity": {
                "summary": f"The {target_market} market in {country} presents a significant opportunity. "
                           f"Based on the business idea '{business_idea[:60]}...', there is strong demand "
                           "driven by digital transformation and changing consumer behavior.",
                "market_size": "$2.4B globally, $180M in target region",
                "growth_rate": "18.5% CAGR (2024–2028)",
                "key_trends": [
                    "Rapid digital adoption among target demographic",
                    "Increasing demand for personalized solutions",
                    "Shift toward subscription-based models",
                    "Growing mobile-first consumer base",
                ],
            },
            "competitors": [
                {
                    "name": "MarketLeader Pro",
                    "description": "Established player with 35% market share, known for enterprise solutions",
                    "strengths": ["Brand recognition", "Large sales team", "Extensive integrations"],
                    "weaknesses": ["High pricing", "Complex onboarding", "Slow innovation"],
                    "market_share": "35%",
                },
                {
                    "name": "QuickSolve",
                    "description": "Fast-growing startup targeting SMBs with simplified approach",
                    "strengths": ["Ease of use", "Affordable pricing", "Modern UI"],
                    "weaknesses": ["Limited features", "Small support team", "No enterprise tier"],
                    "market_share": "12%",
                },
                {
                    "name": "LegacySystems Inc",
                    "description": "Legacy provider losing ground to modern competitors",
                    "strengths": ["Long client relationships", "Stability", "Compliance"],
                    "weaknesses": ["Outdated technology", "Poor UX", "Slow updates"],
                    "market_share": "28%",
                },
            ],
            "customer_personas": [
                {
                    "name": "Alex — The Growth-Focused Founder",
                    "age_range": "28–40",
                    "occupation": "Startup Founder / SMB Owner",
                    "pain_points": [
                        "Overwhelmed by operational complexity",
                        "Limited budget for multiple tools",
                        "Needs results fast with minimal setup",
                    ],
                    "goals": [
                        "Scale revenue without scaling headcount",
                        "Automate repetitive processes",
                        "Make data-driven decisions",
                    ],
                    "preferred_channels": ["LinkedIn", "Product Hunt", "Twitter/X", "Podcasts"],
                },
                {
                    "name": "Jordan — The Digital Manager",
                    "age_range": "32–48",
                    "occupation": "Marketing / Operations Manager at Mid-size Company",
                    "pain_points": [
                        "Siloed tools that don't integrate",
                        "Reporting takes too long",
                        "Justifying budget to executives",
                    ],
                    "goals": [
                        "Centralize workflows",
                        "Demonstrate clear ROI",
                        "Reduce manual reporting",
                    ],
                    "preferred_channels": ["Email", "Industry blogs", "Webinars", "LinkedIn"],
                },
            ],
            "swot": {
                "strengths": [
                    "First-mover advantage in underserved niche",
                    f"Focused specifically on {country} market needs",
                    "Lean cost structure with AI-driven automation",
                ],
                "weaknesses": [
                    "Brand not yet established",
                    "Limited initial feature set vs. incumbents",
                    "Small team bandwidth constraints",
                ],
                "opportunities": [
                    "Growing SMB digitization spending",
                    "Partnership opportunities with complementary platforms",
                    "Geographic expansion after initial market penetration",
                ],
                "threats": [
                    "Well-funded competitors could copy the approach",
                    "Economic slowdown reducing SaaS budgets",
                    "Regulatory changes in target market",
                ],
            },
            "entry_barriers": [
                "Customer trust takes time to build in B2B markets",
                "Sales cycles of 2–6 weeks for SMB segment",
            ],
            "regulatory_notes": f"Operating in {country} requires compliance with local data protection regulations. "
                                "Ensure GDPR/local data privacy compliance. Business registration and tax compliance are standard requirements.",
        }
