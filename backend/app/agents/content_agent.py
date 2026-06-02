from __future__ import annotations
from typing import Any
from app.agents.base_agent import BaseAgent


class ContentAgent(BaseAgent):
    name = "content"

    def _system_prompt(self) -> str:
        return (
            "You are an expert copywriter and content strategist specializing in startup marketing. "
            "You write conversion-focused copy and compelling social content. "
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
        tagline = ""
        uvp = ""
        if prior_results.get("branding"):
            b = prior_results["branding"]
            brand_name = b.get("brand_name", brand_name)
            tagline = b.get("tagline", "")
            uvp = b.get("unique_value_proposition", "")

        return f"""Create complete marketing content for this brand and return JSON:

Business Idea: {business_idea}
Target Market: {target_market}
Brand Name: {brand_name}
Tagline: {tagline}
UVP: {uvp}

Return JSON with this exact structure:
{{
  "website_copy": {{
    "hero": {{
      "headline": "string",
      "subheadline": "string",
      "cta_primary": "string",
      "cta_secondary": "string"
    }},
    "about": {{
      "headline": "string",
      "body": "string"
    }},
    "features": [
      {{"title": "string", "description": "string", "icon": "string"}}
    ],
    "testimonial_template": "string",
    "footer_tagline": "string"
  }},
  "social_media": {{
    "linkedin": ["post1", "post2", "post3"],
    "twitter": ["tweet1", "tweet2", "tweet3"],
    "instagram_captions": ["caption1", "caption2"]
  }},
  "email_templates": [
    {{
      "name": "string",
      "subject": "string",
      "preview_text": "string",
      "body": "string"
    }}
  ],
  "ad_copies": [
    {{
      "platform": "string",
      "headline": "string",
      "body": "string",
      "cta": "string"
    }}
  ]
}}"""

    def _mock_output(
        self,
        business_idea: str,
        target_market: str,
        country: str,
        budget: str,
        prior_results: dict[str, Any],
    ) -> dict[str, Any]:
        brand_name = "Your Brand"
        tagline = ""
        if prior_results.get("branding"):
            b = prior_results["branding"]
            brand_name = b.get("brand_name", brand_name)
            tagline = b.get("tagline", "")

        return {
            "website_copy": {
                "hero": {
                    "headline": f"{brand_name}: {tagline}" if tagline else f"Launch {brand_name} in {country}",
                    "subheadline": f"Our AI agents build your complete business package: market research, "
                                   f"branding, content, sales strategy, and growth roadmap — all tailored for {country}.",
                    "cta_primary": "Build My Business Now",
                    "cta_secondary": "See How It Works",
                },
                "about": {
                    "headline": "5 AI Agents. 1 Complete Business Package.",
                    "body": "We believe every great idea deserves a great launch. That's why we've built "
                            "five specialized AI agents that work together to transform your concept into "
                            "a comprehensive, actionable business strategy. No consultants. No waiting. "
                            "Just results.",
                },
                "features": [
                    {
                        "title": "Market Intelligence",
                        "description": "Deep market analysis, competitor mapping, and customer personas built from real market data.",
                        "icon": "chart-bar",
                    },
                    {
                        "title": "Brand Identity",
                        "description": "Professional brand name, tagline, color palette, and positioning that resonates with your audience.",
                        "icon": "sparkles",
                    },
                    {
                        "title": "Ready-to-Use Content",
                        "description": "Website copy, social media posts, and email templates written and ready to publish.",
                        "icon": "document-text",
                    },
                    {
                        "title": "Sales Blueprint",
                        "description": "Complete sales funnel, pricing strategy, and customer acquisition playbook.",
                        "icon": "trending-up",
                    },
                    {
                        "title": "Growth Analytics",
                        "description": "KPIs, benchmarks, and a 90-day roadmap to hit your first milestones.",
                        "icon": "rocket",
                    },
                ],
                "testimonial_template": '"[Company] helped me go from idea to launch-ready in one afternoon. '
                                        'What would have taken weeks of consultant meetings happened in minutes." — [Name], Founder',
                "footer_tagline": "Build smarter. Launch faster. Grow further.",
            },
            "social_media": {
                "linkedin": [
                    f"Excited to share something we've been building 🚀 What if you could go from business idea to complete launch strategy in under 10 minutes? That's exactly what we've built. Drop your idea in the comments — I'll show you what it generates. #Startup #AI #Entrepreneurship",
                    f"Most founders spend months on what our AI does in minutes:\n✅ Market research & competitor analysis\n✅ Brand identity & positioning\n✅ Website copy & social content\n✅ Sales funnel & pricing strategy\n✅ KPIs & 90-day roadmap\n\nThe future of starting a business is here. #AI #BuildInPublic",
                    f"To every entrepreneur who's had a brilliant idea but didn't know where to start — this is for you. We built AI agents that handle the business planning so you can focus on execution. Now in beta for {country} founders. Link in bio 👇",
                ],
                "twitter": [
                    f"what if your business plan wrote itself 🤯\n\n→ market research ✓\n→ brand identity ✓  \n→ website copy ✓\n→ sales funnel ✓\n→ growth roadmap ✓\n\nall in under 10 min. wild times.",
                    f"spent $0 on consultants.\nused AI agents instead.\ngot a complete business package.\n\nthe future is now.",
                    f"your idea → complete business strategy\n\nin minutes, not months.\n\ntrying to break the internet with this one 👀",
                ],
                "instagram_captions": [
                    f"Your big idea deserves a big launch. 🚀✨\n\nWe built AI agents that transform business ideas into complete packages — market research, branding, content & strategy — all in one place.\n\nLink in bio to try it free.\n\n#Startup #Entrepreneur #AI #BusinessStrategy #BuildInPublic #Founder",
                    f"Stop overthinking. Start building. 💡\n\nThe only tool you need to go from idea to launch-ready. Five AI agents working together so you don't have to do it alone.\n\n#AITools #BusinessGrowth #Entrepreneurship #StartupLife #Innovation",
                ],
            },
            "email_templates": [
                {
                    "name": "Welcome / Onboarding",
                    "subject": "Your business package is being built 🚀",
                    "preview_text": "5 AI agents are working on your idea right now...",
                    "body": "Hi [First Name],\n\nWelcome aboard! Your business package is being generated right now by our 5 AI agents.\n\nHere's what you'll receive:\n• Market Research & Competitor Analysis\n• Complete Brand Identity\n• Website Copy & Marketing Content\n• Sales Funnel & Pricing Strategy\n• KPIs & 90-Day Growth Roadmap\n\nThis usually takes 2–5 minutes. We'll notify you when it's ready.\n\nIn the meantime, think about which part of your business you're most excited to tackle first.\n\nBuilding your future,\nThe Team",
                },
                {
                    "name": "Results Ready",
                    "subject": "Your business package is ready! 🎉",
                    "preview_text": "Your complete business strategy is waiting for you.",
                    "body": "Hi [First Name],\n\nGreat news — your business package is complete!\n\nYour AI agents have delivered:\n✅ Market analysis for your target audience\n✅ Brand identity & positioning\n✅ Ready-to-publish content\n✅ Sales strategy & pricing recommendations\n✅ 90-day growth roadmap\n\n[View Your Results →]\n\nThis is your launchpad. Use it, iterate on it, and go build something amazing.\n\nRooting for you,\nThe Team",
                },
            ],
            "ad_copies": [
                {
                    "platform": "Google Ads",
                    "headline": "Business Plan in 10 Minutes",
                    "body": f"AI agents build your complete business strategy. Market research, branding, content & sales plan. Try free today.",
                    "cta": "Start Building Free",
                },
                {
                    "platform": "Facebook / Instagram",
                    "headline": "From Idea to Business Strategy in Minutes",
                    "body": f"5 specialized AI agents analyze your market, create your brand, write your content, and build your sales strategy — all at once.",
                    "cta": "Try It Free",
                },
            ],
        }
