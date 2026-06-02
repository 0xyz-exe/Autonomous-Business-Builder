"use client";
import type { AgentMeta } from "@/types";

interface ProgressTrackerProps {
  agents: AgentMeta[];
  completedCount: number;
  total: number;
}

export default function ProgressTracker({ agents, completedCount, total }: ProgressTrackerProps) {
  const pct = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  return (
    <div style={{ marginBottom: 32 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#8888AA" }}>
          Pipeline Progress
        </span>
        <span
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: pct === 100 ? "#00D4AA" : "#8B84FF",
          }}
        >
          {completedCount}/{total} agents complete ({pct}%)
        </span>
      </div>

      {/* Progress bar */}
      <div
        style={{
          height: 6,
          background: "rgba(255,255,255,0.06)",
          borderRadius: 3,
          overflow: "hidden",
          marginBottom: 16,
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: pct === 100
              ? "linear-gradient(90deg, #00D4AA, #6C63FF)"
              : "linear-gradient(90deg, #6C63FF, #8B84FF)",
            borderRadius: 3,
            transition: "width 0.5s ease",
          }}
        />
      </div>

      {/* Step dots */}
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        {agents.map((agent, i) => {
          const isDone = i < completedCount;
          const isRunning = i === completedCount;
          return (
            <div
              key={agent.name}
              style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}
            >
              <div
                title={agent.label}
                style={{
                  flex: 1,
                  height: 3,
                  background: isDone
                    ? `linear-gradient(90deg, ${agent.color}, ${agent.color}88)`
                    : "rgba(255,255,255,0.06)",
                  borderRadius: 2,
                  transition: "all 0.4s ease",
                  boxShadow: isRunning ? `0 0 8px ${agent.color}` : "none",
                }}
              />
              <span
                style={{
                  fontSize: 11,
                  color: isDone ? agent.color : isRunning ? "#F0F0FF" : "#333355",
                  fontWeight: isDone || isRunning ? 600 : 400,
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                {agent.icon}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
