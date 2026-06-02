"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import type { BusinessProject, AgentResult, AgentName } from "@/types";
import { AGENT_META } from "@/types";
import AgentCard from "@/components/AgentCard";
import ProgressTracker from "@/components/ProgressTracker";
import ResultsPanel from "@/components/ResultsPanel";
import LandingPagePreview from "@/components/LandingPagePreview";

const POLL_INTERVAL_MS = 3000;

function getAgentStatus(
  agentName: AgentName,
  results: AgentResult[],
  projectStatus: string,
  completedAgents: AgentName[]
): "idle" | "running" | "done" | "error" {
  const result = results.find((r) => r.agent_name === agentName);
  if (result) {
    if ("error" in result.result_json) return "error";
    return "done";
  }
  if (projectStatus === "running") {
    // The next agent after the last completed one is "running"
    const completedIdx = completedAgents.length;
    const agentIdx = AGENT_META.findIndex((a) => a.name === agentName);
    if (agentIdx === completedIdx) return "running";
  }
  return "idle";
}

export default function ResultsPage() {
  const { id } = useParams<{ id: string }>();

  const [project, setProject] = useState<BusinessProject | null>(null);
  const [error, setError] = useState("");
  const [isPolling, setIsPolling] = useState(true);
  const [retryingAgent, setRetryingAgent] = useState<AgentName | null>(null);

  const fetchProject = useCallback(async () => {
    try {
      const data = await api.getProject(id);
      setProject(data);
      if (data.status === "completed" || data.status === "failed") {
        setIsPolling(false);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load project");
      setIsPolling(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  useEffect(() => {
    if (!isPolling) return;
    const timer = setInterval(fetchProject, POLL_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [isPolling, fetchProject]);

  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 20,
          padding: 24,
        }}
      >
        <div style={{ fontSize: 48 }}>⚠️</div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#FF6584" }}>Something went wrong</h2>
        <p style={{ color: "#8888AA", textAlign: "center" }}>{error}</p>
        <Link href="/" className="btn-primary" style={{ textDecoration: "none", position: "relative", zIndex: 1 }}>
          ← Back to Home
        </Link>
      </div>
    );
  }

  if (!project) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            border: "3px solid rgba(108,99,255,0.2)",
            borderTopColor: "#6C63FF",
            borderRadius: "50%",
            animation: "spin-slow 0.8s linear infinite",
          }}
        />
        <p style={{ color: "#8888AA", fontSize: 15 }}>Loading your results...</p>
      </div>
    );
  }

  const completedAgents = AGENT_META.filter((a) =>
    project.results.some((r) => r.agent_name === a.name)
  ).map((a) => a.name);

  const isComplete = project.status === "completed";
  const isFailed = project.status === "failed";
  const isRunning = project.status === "running" || project.status === "pending";

  const brandingResult = project.results.find((r) => r.agent_name === "branding");
  const contentResult = project.results.find((r) => r.agent_name === "content");
  const brandingJson = brandingResult?.result_json as Record<string, unknown> | undefined;
  const contentJson = contentResult?.result_json as Record<string, unknown> | undefined;
  const websiteCopy = contentJson?.website_copy as Record<string, unknown> | undefined;

  const handleRetryAgent = async (agentName: AgentName) => {
    setRetryingAgent(agentName);
    setError("");
    try {
      await api.runAgent(id, agentName);
      await fetchProject();
      setIsPolling(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Retry failed");
    } finally {
      setRetryingAgent(null);
    }
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(project, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `business-package-${project.id.slice(0, 8)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ minHeight: "100vh", paddingTop: 80 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>

        {/* Page Header */}
        <div style={{ marginBottom: 40 }}>
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              color: "#8888AA",
              textDecoration: "none",
              fontSize: 13,
              marginBottom: 24,
              transition: "color 0.2s",
            }}
          >
            ← Back to Home
          </Link>

          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div>
              <h1
                style={{
                  fontSize: "clamp(22px, 3vw, 36px)",
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  marginBottom: 8,
                }}
              >
                {isComplete ? "🎉 " : isRunning ? "⚡ " : "⚠️ "}
                Business Package{" "}
                <span className="gradient-text">
                  {isComplete ? "Ready" : isRunning ? "Generating..." : "Failed"}
                </span>
              </h1>
              <p
                style={{
                  color: "#8888AA",
                  fontSize: 15,
                  maxWidth: 520,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {project.business_idea}
              </p>
            </div>

            {/* Project meta badges */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              <span className="badge badge-pending" style={{ background: "rgba(255,255,255,0.05)", color: "#8888AA", border: "1px solid rgba(255,255,255,0.08)" }}>
                🌍 {project.country}
              </span>
              <span className="badge badge-pending" style={{ background: "rgba(255,255,255,0.05)", color: "#8888AA", border: "1px solid rgba(255,255,255,0.08)" }}>
                💰 {project.budget}
              </span>
              <span
                className={`badge badge-${project.status === "completed" ? "completed" : project.status === "failed" ? "failed" : "running"}`}
              >
                {project.status === "completed"
                  ? "✓ Completed"
                  : project.status === "failed"
                  ? "✗ Failed"
                  : project.status === "running"
                  ? "⚡ Running"
                  : "⏳ Pending"}
              </span>
              {isComplete && (
                <button
                  type="button"
                  onClick={handleExport}
                  className="btn-secondary"
                  style={{ fontSize: 13, padding: "6px 14px", cursor: "pointer" }}
                >
                  ↓ Export JSON
                </button>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: 28, alignItems: "start" }}>

          {/* Left Column: Agent Pipeline */}
          <div>
            <div
              className="glass-card"
              style={{ padding: 24, position: "sticky", top: 88 }}
            >
              <h2 style={{ fontSize: 14, fontWeight: 700, color: "#8888AA", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 20 }}>
                Agent Pipeline
              </h2>

              <ProgressTracker
                agents={AGENT_META}
                completedCount={completedAgents.length}
                total={AGENT_META.length}
              />

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {AGENT_META.map((agent, i) => {
                  const status = getAgentStatus(agent.name, project.results, project.status, completedAgents);
                  return (
                    <AgentCard
                      key={agent.name}
                      agent={agent}
                      status={status}
                      step={i + 1}
                      isActive={status === "running"}
                      retrying={retryingAgent === agent.name}
                      onRetry={
                        status === "error"
                          ? () => handleRetryAgent(agent.name)
                          : undefined
                      }
                    />
                  );
                })}
              </div>

              {/* Summary */}
              <div
                style={{
                  marginTop: 20,
                  padding: "14px 16px",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  borderRadius: 10,
                  fontSize: 12,
                  color: "#555577",
                  textAlign: "center",
                  lineHeight: 1.6,
                }}
              >
                {isComplete ? (
                  <span style={{ color: "#00D4AA" }}>
                    ✓ All agents completed successfully
                  </span>
                ) : isFailed ? (
                  <span style={{ color: "#FF6584" }}>
                    Pipeline encountered errors
                  </span>
                ) : (
                  <>
                    Polling every {POLL_INTERVAL_MS / 1000}s
                    <span
                      style={{
                        display: "inline-block",
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "#6C63FF",
                        marginLeft: 6,
                        animation: "pulse-glow 1s ease-in-out infinite",
                        verticalAlign: "middle",
                      }}
                    />
                  </>
                )}
              </div>

              {isComplete && (
                <Link
                  href="/new-business"
                  className="btn-primary"
                  style={{
                    display: "block",
                    textAlign: "center",
                    textDecoration: "none",
                    marginTop: 16,
                    padding: "12px 20px",
                    fontSize: 14,
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  + Build Another Business
                </Link>
              )}
            </div>
          </div>

          {/* Right Column: Results */}
          <div>
            {websiteCopy && !("error" in (contentJson ?? {})) && (
              <LandingPagePreview
                brandName={String(brandingJson?.brand_name ?? "Your Brand")}
                tagline={String(brandingJson?.tagline ?? "")}
                colors={brandingJson?.brand_colors as { primary?: string; secondary?: string; accent?: string }}
                websiteCopy={websiteCopy as { hero?: { headline?: string; subheadline?: string; cta_primary?: string; cta_secondary?: string }; about?: { headline?: string; body?: string }; features?: Array<{ title?: string; description?: string }>; footer_tagline?: string }}
              />
            )}

            {project.results.length === 0 && isRunning ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 20,
                  padding: "80px 40px",
                  border: "1px solid rgba(255,255,255,0.05)",
                  borderRadius: 16,
                  background: "rgba(255,255,255,0.01)",
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    border: "3px solid rgba(108,99,255,0.15)",
                    borderTopColor: "#6C63FF",
                    borderRadius: "50%",
                    animation: "spin-slow 0.9s linear infinite",
                  }}
                />
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 8 }}>
                    Agents are working...
                  </div>
                  <div style={{ color: "#8888AA", fontSize: 14 }}>
                    Results will appear here as each agent completes
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {project.results.map((result) => {
                  const agentMeta = AGENT_META.find((a) => a.name === result.agent_name);
                  if (!agentMeta) return null;
                  return (
                    <ResultsPanel
                      key={result.id}
                      result={result}
                      agent={agentMeta}
                    />
                  );
                })}

                {/* Placeholder cards for pending agents */}
                {isRunning &&
                  AGENT_META.filter(
                    (a) => !project.results.some((r) => r.agent_name === a.name)
                  ).map((agent) => (
                    <div
                      key={agent.name}
                      style={{
                        border: "1px solid rgba(255,255,255,0.05)",
                        borderRadius: 16,
                        padding: "20px 24px",
                        display: "flex",
                        alignItems: "center",
                        gap: 14,
                      }}
                    >
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 10,
                          background: "rgba(255,255,255,0.03)",
                        }}
                        className="skeleton"
                      />
                      <div style={{ flex: 1 }}>
                        <div
                          className="skeleton"
                          style={{ width: "40%", height: 14, marginBottom: 8 }}
                        />
                        <div
                          className="skeleton"
                          style={{ width: "65%", height: 11 }}
                        />
                      </div>
                      <span style={{ color: "#333355", fontSize: 12 }}>Waiting...</span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
