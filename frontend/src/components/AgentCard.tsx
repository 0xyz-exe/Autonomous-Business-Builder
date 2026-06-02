"use client";
import type { AgentMeta } from "@/types";

interface AgentCardProps {
  agent: AgentMeta;
  status: "idle" | "running" | "done" | "error";
  step: number;
  isActive: boolean;
  onRetry?: () => void;
  retrying?: boolean;
}

const STATUS_CONFIG = {
  idle: { label: "Waiting", color: "#444466", bgColor: "rgba(68,68,102,0.12)" },
  running: { label: "Running...", color: "#8B84FF", bgColor: "rgba(108,99,255,0.12)" },
  done: { label: "Complete", color: "#00D4AA", bgColor: "rgba(0,212,170,0.12)" },
  error: { label: "Error", color: "#FF6584", bgColor: "rgba(255,101,132,0.12)" },
};

export default function AgentCard({
  agent,
  status,
  step,
  isActive,
  onRetry,
  retrying,
}: AgentCardProps) {
  const cfg = STATUS_CONFIG[status];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "16px 20px",
        background: isActive
          ? "rgba(108,99,255,0.08)"
          : status === "done"
          ? "rgba(0,212,170,0.04)"
          : "rgba(255,255,255,0.02)",
        border: `1px solid ${
          isActive
            ? "rgba(108,99,255,0.3)"
            : status === "done"
            ? "rgba(0,212,170,0.2)"
            : status === "error"
            ? "rgba(255,101,132,0.25)"
            : "rgba(255,255,255,0.06)"
        }`,
        borderRadius: 12,
        transition: "all 0.3s ease",
        boxShadow: isActive ? "0 0 20px rgba(108,99,255,0.12)" : "none",
      }}
    >
      <div style={{ position: "relative", flexShrink: 0 }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: `${agent.color}18`,
            border: `1px solid ${agent.color}30`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
          }}
        >
          {status === "running" || retrying ? (
            <span style={{ display: "inline-block", animation: "spin-slow 1s linear infinite" }}>⚙️</span>
          ) : (
            agent.icon
          )}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: -4,
            right: -4,
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: status === "done" ? "#00D4AA" : "#1A1A2E",
            border: "2px solid #0A0A0F",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 9,
            fontWeight: 700,
            color: status === "done" ? "#0A0A0F" : "#555577",
          }}
        >
          {status === "done" ? "✓" : step}
        </div>
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: 14, color: "#F0F0FF", marginBottom: 2 }}>
          {agent.label}
        </div>
        <div
          style={{
            fontSize: 12,
            color: "#8888AA",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {agent.description}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0 }}>
        <div
          style={{
            padding: "4px 12px",
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 600,
            color: cfg.color,
            background: cfg.bgColor,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          {status === "running" && (
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: cfg.color,
                animation: "pulse-glow 1s ease-in-out infinite",
              }}
            />
          )}
          {retrying ? "Retrying..." : cfg.label}
        </div>
        {status === "error" && onRetry && (
          <button
            type="button"
            onClick={onRetry}
            disabled={retrying}
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: "#FF6584",
              background: "rgba(255,101,132,0.1)",
              border: "1px solid rgba(255,101,132,0.3)",
              borderRadius: 6,
              padding: "4px 10px",
              cursor: retrying ? "not-allowed" : "pointer",
            }}
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
}
