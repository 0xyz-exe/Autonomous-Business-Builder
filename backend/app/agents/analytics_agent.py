from __future__ import annotations
from typing import Any
from app.agents.base_agent import BaseAgent


class AnalyticsAgent(BaseAgent):
    name = "analytics"

    def _system_prompt(self) -> str:
        return (
            "You are a startup analytics expert and business intelligence strategist. "
            "You define measurable KPIs and create actionable growth roadmaps. "
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
        revenue_proj = ""
        if prior_results.get("sales"):
            rp = prior_results["sales"].get("revenue_projections", {})
            revenue_proj = f"\nRevenue targets: M3={rp.get('month_3','')}, M6={rp.get('month_6','')}, M12={rp.get('month_12','')}"

        return f"""Define KPIs and a growth roadmap for this business and return JSON:

Business Idea: {business_idea}
Target Market: {target_market}
Country: {country}
Budget: {budget}{revenue_proj}

Return JSON with this exact structure:
{{
  "kpis": [
    {{
      "category": "string",
      "metric": "string",
      "target_30d": "string",
      "target_90d": "string",
      "target_12m": "string",
      "measurement_method": "string"
    }}
  ],
  "north_star_metric": {{
    "name": "string",
    "definition": "string",
    "current_baseline": "string",
    "target": "string"
  }},
  "roadmap_90_days": [
    {{
      "week": "string",
      "focus": "string",
      "tasks": ["t1", "t2", "t3"],
      "milestone": "string"
    }}
  ],
  "recommendations": [
    {{
      "priority": "string",
      "category": "string",
      "recommendation": "string",
      "expected_impact": "string"
    }}
  ],
  "analytics_stack": {{
    "product_analytics": "string",
    "marketing_analytics": "string",
    "financial_tracking": "string",
    "customer_feedback": "string"
  }},
  "risk_mitigation": ["r1", "r2", "r3"]
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
            "kpis": [
                {
                    "category": "Acquisition",
                    "metric": "Monthly Signups",
                    "target_30d": "200 signups",
                    "target_90d": "1,200 signups",
                    "target_12m": "18,000 signups",
                    "measurement_method": "Analytics dashboard (Mixpanel/PostHog)",
                },
                {
                    "category": "Activation",
                    "metric": "Business Package Completion Rate",
                    "target_30d": "60%",
                    "target_90d": "72%",
                    "target_12m": "80%",
                    "measurement_method": "Funnel analysis — signup to first generated package",
                },
                {
                    "category": "Revenue",
                    "metric": "Monthly Recurring Revenue (MRR)",
                    "target_30d": "$1,200",
                    "target_90d": "$4,200",
                    "target_12m": "$67,000",
                    "measurement_method": "Stripe MRR dashboard",
                },
                {
                    "category": "Retention",
                    "metric": "Monthly Churn Rate",
                    "target_30d": "< 20% (early launch)",
                    "target_90d": "< 15%",
                    "target_12m": "< 10%",
                    "measurement_method": "Cohort retention analysis in Stripe + internal dashboard",
                },
                {
                    "category": "Engagement",
                    "metric": "Packages Generated per Active User",
                    "target_30d": "1.5 avg",
                    "target_90d": "3.0 avg",
                    "target_12m": "6.0 avg",
                    "measurement_method": "Product analytics — event tracking",
                },
                {
                    "category": "Viral Growth",
                    "metric": "Net Promoter Score (NPS)",
                    "target_30d": "Baseline survey",
                    "target_90d": "> 40",
                    "target_12m": "> 55",
                    "measurement_method": "In-app NPS survey (Delighted or Typeform)",
                },
            ],
            "north_star_metric": {
                "name": "Weekly Active Builders",
                "definition": "Number of unique users who generate at least one business package in a 7-day window.",
                "current_baseline": "0 (pre-launch)",
                "target": "500 WAB by Month 3, 5,000 WAB by Month 12",
            },
            "roadmap_90_days": [
                {
                    "week": "Week 1–2",
                    "focus": "Launch & Initial Acquisition",
                    "tasks": [
                        "Ship MVP to production",
                        "Launch on Product Hunt",
                        "Activate LinkedIn/Twitter content strategy",
                        "Send launch emails to personal network",
                    ],
                    "milestone": "100 signed-up users",
                },
                {
                    "week": "Week 3–4",
                    "focus": "Onboarding Optimization",
                    "tasks": [
                        "Analyze drop-off in first-package completion funnel",
                        "Implement guided onboarding tour",
                        "Add pre-filled example business idea",
                        "Set up email automation for inactive users",
                    ],
                    "milestone": "70% activation rate on new signups",
                },
                {
                    "week": "Week 5–6",
                    "focus": "First Revenue & Feedback Loop",
                    "tasks": [
                        "Launch paid tiers via Stripe",
                        "Run 10 user interviews with active free users",
                        "Identify top 3 feature requests",
                        "Deploy first post-launch product improvements",
                    ],
                    "milestone": "25 paid subscribers, $1,200 MRR",
                },
                {
                    "week": "Week 7–8",
                    "focus": "Growth Channel Testing",
                    "tasks": [
                        "Test $500 Google Ads budget on 3 keyword clusters",
                        f"Partner with 2 startup communities in {country}",
                        "Publish 3 long-form SEO articles",
                        "Launch referral program",
                    ],
                    "milestone": "Identify top-performing acquisition channel",
                },
                {
                    "week": "Week 9–12",
                    "focus": "Scale What Works",
                    "tasks": [
                        "Double budget to best-performing channel",
                        "Ship top-requested feature",
                        "Target first case study / success story",
                        "Prepare Month 4 growth plan",
                    ],
                    "milestone": "$4,200 MRR, 85 paid users, clear growth playbook",
                },
            ],
            "recommendations": [
                {
                    "priority": "Critical",
                    "category": "Product",
                    "recommendation": "Nail the first-use experience — the moment a user sees their first complete business package should be magical. Invest heavily in output quality and presentation.",
                    "expected_impact": "10–15% improvement in activation rate, drives word-of-mouth",
                },
                {
                    "priority": "High",
                    "category": "Growth",
                    "recommendation": "Build in public on LinkedIn and Twitter. Document the journey of building this product while showing real customer results. Founders are your audience — they love authenticity.",
                    "expected_impact": "Organic audience of 2,000–5,000 relevant followers within 90 days",
                },
                {
                    "priority": "High",
                    "category": "Revenue",
                    "recommendation": "Introduce annual pricing at 20% discount from day one. Annual plans reduce churn dramatically and improve cash flow.",
                    "expected_impact": "20–30% of paid users on annual = 12x revenue certainty",
                },
                {
                    "priority": "Medium",
                    "category": "Retention",
                    "recommendation": "Create a 'business update' feature that lets users re-run agents after 90 days to refresh their strategy. This drives habitual engagement.",
                    "expected_impact": "Monthly active user rate increases by estimated 25%",
                },
                {
                    "priority": "Medium",
                    "category": "Partnerships",
                    "recommendation": f"Partner with business incubators and accelerators in {country} for group licensing deals — $500–$2,000/cohort for unlimited access.",
                    "expected_impact": "B2B revenue stream that is predictable and high-value",
                },
            ],
            "analytics_stack": {
                "product_analytics": "PostHog (open-source, self-hostable) or Mixpanel for event tracking, funnels, and cohort analysis",
                "marketing_analytics": "Google Analytics 4 + UTM tracking on all campaigns. LinkedIn Insights Tag for B2B attribution.",
                "financial_tracking": "Stripe Dashboard + Baremetrics for MRR, churn, LTV, and cohort revenue analysis",
                "customer_feedback": "Typeform for NPS surveys, Intercom or Crisp for in-app chat and support tickets",
            },
            "risk_mitigation": [
                "OpenAI API costs scale with usage — implement rate limiting and caching for repeated similar inputs to control cost per user",
                "If organic growth is slow at Week 4, activate $1,000 paid acquisition budget earlier than planned",
                f"Regulatory risk in {country}: consult local legal counsel for data handling requirements before scaling past 1,000 users",
                "Competitor copy risk: focus on community building and brand, which are hard to replicate vs. features alone",
            ],
        }
