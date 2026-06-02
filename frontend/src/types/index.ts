export type ProjectStatus = "pending" | "running" | "completed" | "failed";

export type AgentName = "market" | "branding" | "content" | "sales" | "analytics";

export interface AgentResult {
  id: string;
  project_id: string;
  agent_name: AgentName;
  result_json: Record<string, unknown>;
  created_at: string;
}

export interface BusinessProject {
  id: string;
  business_idea: string;
  target_market: string;
  country: string;
  budget: string;
  status: ProjectStatus;
  created_at: string;
  results: AgentResult[];
}

export interface BusinessProjectSummary {
  id: string;
  business_idea: string;
  target_market: string;
  country: string;
  budget: string;
  status: ProjectStatus;
  created_at: string;
}

export interface CreateProjectPayload {
  business_idea: string;
  target_market: string;
  country: string;
  budget: string;
}

export interface AgentMeta {
  name: AgentName;
  label: string;
  description: string;
  icon: string;
  color: string;
}

export const AGENT_META: AgentMeta[] = [
  {
    name: "market",
    label: "Market Research",
    description: "Analyzes market opportunity, competitors & customer personas",
    icon: "📊",
    color: "#6C63FF",
  },
  {
    name: "branding",
    label: "Branding",
    description: "Generates brand name, tagline & visual identity",
    icon: "✨",
    color: "#FF6584",
  },
  {
    name: "content",
    label: "Content",
    description: "Creates website copy, social posts & email templates",
    icon: "✍️",
    color: "#43D9B4",
  },
  {
    name: "sales",
    label: "Sales Strategy",
    description: "Builds pricing tiers, sales funnel & acquisition channels",
    icon: "📈",
    color: "#FFB347",
  },
  {
    name: "analytics",
    label: "Analytics",
    description: "Defines KPIs, 90-day roadmap & growth recommendations",
    icon: "🚀",
    color: "#56CCF2",
  },
];
