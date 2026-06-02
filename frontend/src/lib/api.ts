import type { BusinessProject, BusinessProjectSummary, CreateProjectPayload, AgentResult } from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(error.detail || `HTTP ${res.status}`);
  }

  return res.json();
}

export const api = {
  /** Create a new business project and trigger the agent pipeline */
  createProject: (payload: CreateProjectPayload) =>
    request<BusinessProjectSummary>("/projects", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  /** Get a project with all agent results */
  getProject: (id: string) => request<BusinessProject>(`/projects/${id}`),

  /** List all projects */
  listProjects: () => request<BusinessProjectSummary[]>("/projects"),

  /** Get all agent results for a project */
  getResults: (projectId: string) =>
    request<AgentResult[]>(`/results/${projectId}`),

  /** Re-run a single agent (retry failed or refresh output) */
  runAgent: (projectId: string, agentName: string) =>
    request<{ success: boolean; message: string }>("/agents/run", {
      method: "POST",
      body: JSON.stringify({ project_id: projectId, agent_name: agentName }),
    }),
};
