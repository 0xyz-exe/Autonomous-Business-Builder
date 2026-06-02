from __future__ import annotations
from typing import Any
from app.agents.base_agent import BaseAgent


class SalesAgent(BaseAgent):
    name = "sales"

    def _system_prompt(self) -> str:
        return (
            "You are a senior sales strategist and growth expert with experience scaling B2B and B2C startups. "
            "You create practical, revenue-focused sales frameworks. "
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
        brand_name = "the company"
        uvp = ""
        if prior_results.get("branding"):
            brand_name = prior_results["branding"].get("brand_name", brand_name)
            uvp = prior_results["branding"].get("unique_value_proposition", "")

        return f"""Create a complete sales strategy and return JSON:

Business Idea: {business_idea}
Target Market: {target_market}
Country: {country}
Budget: {budget}
Brand: {brand_name}
UVP: {uvp}

Return JSON with this exact structure:
{{
  "pricing_strategy": {{
    "model": "string",
    "tiers": [
      {{"name": "string", "price": "string", "features": ["f1", "f2"], "target": "string"}}
    ],
    "rationale": "string"
  }},
  "sales_funnel": [
    {{"stage": "string", "description": "string", "tactics": ["t1", "t2"], "conversion_target": "string"}}
  ],
  "acquisition_channels": [
    {{"channel": "string", "strategy": "string", "estimated_cac": "string", "priority": "string"}}
  ],
  "sales_scripts": [
    {{"scenario": "string", "script": "string"}}
  ],
  "revenue_projections": {{
    "month_3": "string",
    "month_6": "string",
    "month_12": "string",
    "assumptions": ["a1", "a2"]
  }},
  "partnership_opportunities": ["p1", "p2"]
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
            "pricing_strategy": {
                "model": "Freemium + Subscription (SaaS)",
                "tiers": [
                    {
                        "name": "Starter",
                        "price": "Free",
                        "features": [
                            "1 business package per month",
                            "Basic market analysis",
                            "PDF export",
                        ],
                        "target": "Solopreneurs & students testing ideas",
                    },
                    {
                        "name": "Growth",
                        "price": "$49/month",
                        "features": [
                            "10 business packages per month",
                            "Full AI agent suite",
                            "Priority processing",
                            "Export to Notion/Google Docs",
                            "Email support",
                        ],
                        "target": "Active founders & early-stage startups",
                    },
                    {
                        "name": "Scale",
                        "price": "$149/month",
                        "features": [
                            "Unlimited packages",
                            "Custom agent prompts",
                            "API access",
                            "Team collaboration (5 seats)",
                            "Priority support + onboarding call",
                        ],
                        "target": "Growing startups & agencies",
                    },
                ],
                "rationale": "Freemium drives acquisition with zero friction. "
                             "Growth tier monetizes active users. "
                             "Scale tier captures high-value teams and agencies with usage needs.",
            },
            "sales_funnel": [
                {
                    "stage": "Awareness",
                    "description": "Potential customers discover the product through content, ads, or word of mouth",
                    "tactics": [
                        "Publish viral 'before/after' business package demos on LinkedIn & Twitter",
                        "SEO content targeting 'how to start a business' queries",
                        "Product Hunt launch",
                        "YouTube tutorial: 'Build Your Startup Plan in 10 Minutes'",
                    ],
                    "conversion_target": "5% of viewers click through to site",
                },
                {
                    "stage": "Interest",
                    "description": "Visitors explore the product and understand the value proposition",
                    "tactics": [
                        "Compelling landing page with live demo",
                        "Free tier with no credit card required",
                        "Case studies and sample outputs",
                    ],
                    "conversion_target": "30% sign up for free tier",
                },
                {
                    "stage": "Activation",
                    "description": "User submits their first business idea and sees the output",
                    "tactics": [
                        "Smooth onboarding with guided tour",
                        "Pre-filled example to lower barrier",
                        "Immediate 'wow moment' with quality output",
                    ],
                    "conversion_target": "70% complete first business package",
                },
                {
                    "stage": "Conversion",
                    "description": "Free users upgrade to paid plan",
                    "tactics": [
                        "Usage limits trigger upgrade prompts",
                        "Email sequence showcasing advanced features",
                        "Time-limited 30% launch discount",
                    ],
                    "conversion_target": "8% free-to-paid conversion",
                },
                {
                    "stage": "Retention",
                    "description": "Paid users continue subscription and expand usage",
                    "tactics": [
                        "Monthly new agent features",
                        "Customer success check-ins",
                        "Referral program: 1 month free per referral",
                    ],
                    "conversion_target": "85% monthly retention rate",
                },
            ],
            "acquisition_channels": [
                {
                    "channel": "Organic Content (LinkedIn + Twitter)",
                    "strategy": "Founder shares real use cases, before/after demos, and business tips. "
                                "Build in public to grow an audience of startup-minded followers.",
                    "estimated_cac": "$0–$5",
                    "priority": "High",
                },
                {
                    "channel": "Product Hunt Launch",
                    "strategy": "Launch on Product Hunt with coordinated upvote campaign. "
                                "Target #1 Product of the Day for massive organic exposure.",
                    "estimated_cac": "$10–$20",
                    "priority": "High",
                },
                {
                    "channel": "Google Ads (Search)",
                    "strategy": "Target high-intent keywords: 'business plan generator', "
                                "'AI business strategy', 'startup market research tool'.",
                    "estimated_cac": "$25–$60",
                    "priority": "Medium",
                },
                {
                    "channel": "Startup & Entrepreneurship Communities",
                    "strategy": f"Active presence in {country} startup Slack groups, Reddit r/startups, "
                                "IndieHackers, and relevant Facebook Groups.",
                    "estimated_cac": "$5–$15",
                    "priority": "Medium",
                },
            ],
            "sales_scripts": [
                {
                    "scenario": "Cold outreach DM (LinkedIn)",
                    "script": "Hey [Name], saw your post about launching [X]. I built something that "
                              "might save you weeks of planning — AI agents that generate a complete "
                              "business package (market research, branding, content, sales strategy) "
                              "in minutes. Happy to share a demo? Takes 5 min to see the output.",
                },
                {
                    "scenario": "Free-to-paid upgrade email",
                    "script": "Hi [Name], you generated your first business package last week — "
                              "that's exciting! I noticed you've been back a few times. "
                              "If you're ready to go deeper with unlimited packages, custom agent "
                              "prompts, and export features, Growth plan is $49/month with a "
                              "7-day free trial. No commitment. Grab it here: [link]",
                },
            ],
            "revenue_projections": {
                "month_3": "$4,200 MRR (85 paid users)",
                "month_6": "$18,500 MRR (375 paid users)",
                "month_12": "$67,000 MRR (1,350 paid users)",
                "assumptions": [
                    "8% free-to-paid conversion rate",
                    "85% monthly retention (churn < 15%)",
                    "Average revenue per user: $52/month",
                    f"Launch budget of {budget} deployed primarily to content and paid acquisition",
                ],
            },
            "partnership_opportunities": [
                f"Integration with Notion, Google Workspace, and HubSpot for {country} SMB market",
                "Accelerator and co-working space partnerships for bulk access deals",
                "White-label licensing to business consulting firms",
                "Affiliate program with startup newsletter authors and YouTubers",
            ],
        }
