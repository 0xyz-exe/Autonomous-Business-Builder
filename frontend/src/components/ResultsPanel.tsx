"use client";
import { useState } from "react";
import type { AgentResult, AgentMeta } from "@/types";

interface ResultsPanelProps {
  result: AgentResult;
  agent: AgentMeta;
}

function JsonValue({ value, depth = 0 }: { value: unknown; depth?: number }) {
  if (value === null || value === undefined) return <span style={{ color: "#555577" }}>null</span>;

  if (typeof value === "boolean") {
    return <span style={{ color: "#FFB347" }}>{value.toString()}</span>;
  }

  if (typeof value === "number") {
    return <span style={{ color: "#56CCF2" }}>{value}</span>;
  }

  if (typeof value === "string") {
    return (
      <span style={{ color: "#F0F0FF", lineHeight: 1.6 }}>
        {value}
      </span>
    );
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return <span style={{ color: "#555577" }}>[]</span>;
    return (
      <ul style={{ margin: 0, paddingLeft: depth === 0 ? 0 : 16, listStyle: "none" }}>
        {value.map((item, i) => (
          <li key={i} style={{ marginBottom: 8, display: "flex", gap: 8 }}>
            <span style={{ color: "#6C63FF", flexShrink: 0, fontSize: 12, marginTop: 2 }}>▸</span>
            <span style={{ flex: 1 }}>
              {typeof item === "object" ? (
                <JsonValue value={item} depth={depth + 1} />
              ) : (
                <span style={{ color: "#F0F0FF", lineHeight: 1.6 }}>{String(item)}</span>
              )}
            </span>
          </li>
        ))}
      </ul>
    );
  }

  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) return <span style={{ color: "#555577" }}>{"{}"}</span>;
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {entries.map(([key, val]) => (
          <div key={key}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "#8888AA",
                marginBottom: 4,
              }}
            >
              {key.replace(/_/g, " ")}
            </div>
            <div style={{ paddingLeft: 8, borderLeft: "2px solid rgba(255,255,255,0.06)" }}>
              <JsonValue value={val} depth={depth + 1} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return <span>{String(value)}</span>;
}

export default function ResultsPanel({ result, agent }: ResultsPanelProps) {
  const [expanded, setExpanded] = useState(true);

  const isError = "error" in result.result_json;

  return (
    <div
      style={{
        border: `1px solid ${expanded ? `${agent.color}30` : "rgba(255,255,255,0.06)"}`,
        borderRadius: 16,
        overflow: "hidden",
        transition: "all 0.3s ease",
        background: expanded ? `${agent.color}06` : "transparent",
      }}
    >
      {/* Header */}
      <button
        onClick={() => setExpanded((prev) => !prev)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "18px 24px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          gap: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {/* Icon */}
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: `${agent.color}18`,
              border: `1px solid ${agent.color}30`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              flexShrink: 0,
            }}
          >
            {agent.icon}
          </div>

          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: "#F0F0FF" }}>
              {agent.label} Results
            </div>
            <div style={{ fontSize: 12, color: "#8888AA" }}>
              {isError
                ? "Agent encountered an error"
                : `${Object.keys(result.result_json).length} sections generated`}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Status pill */}
          <div
            style={{
              padding: "3px 10px",
              borderRadius: 20,
              fontSize: 11,
              fontWeight: 600,
              color: isError ? "#FF6584" : "#00D4AA",
              background: isError ? "rgba(255,101,132,0.12)" : "rgba(0,212,170,0.12)",
              border: `1px solid ${isError ? "rgba(255,101,132,0.25)" : "rgba(0,212,170,0.25)"}`,
            }}
          >
            {isError ? "⚠ Error" : "✓ Done"}
          </div>

          {/* Chevron */}
          <div
            style={{
              color: "#555577",
              fontSize: 14,
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease",
            }}
          >
            ▼
          </div>
        </div>
      </button>

      {/* Content */}
      {expanded && (
        <div
          style={{
            padding: "0 24px 24px",
            borderTop: `1px solid rgba(255,255,255,0.04)`,
          }}
        >
          {isError ? (
            <div
              style={{
                padding: "16px",
                background: "rgba(255,101,132,0.08)",
                border: "1px solid rgba(255,101,132,0.2)",
                borderRadius: 10,
                color: "#FF6584",
                fontSize: 14,
                marginTop: 16,
              }}
            >
              {String((result.result_json as Record<string, unknown>).error || "Unknown error")}
            </div>
          ) : (
            <div style={{ marginTop: 16 }}>
              <JsonValue value={result.result_json} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
