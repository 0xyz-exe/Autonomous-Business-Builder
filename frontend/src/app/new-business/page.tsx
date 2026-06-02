"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { AGENT_META } from "@/types";

const BUDGET_OPTIONS = [
  "< $1,000",
  "$1,000 – $5,000",
  "$5,000 – $20,000",
  "$20,000 – $100,000",
  "$100,000+",
];

const COUNTRY_OPTIONS = [
  "United States", "United Kingdom", "Canada", "Australia", "Germany",
  "France", "Netherlands", "Singapore", "Indonesia", "India", "Japan",
  "Brazil", "Mexico", "South Africa", "UAE", "Other",
];

export default function NewBusinessPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    business_idea: "",
    target_market: "",
    country: "",
    budget: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [charCount, setCharCount] = useState(0);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "business_idea") setCharCount(value.length);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.business_idea || !form.target_market || !form.country || !form.budget) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const project = await api.createProject(form);
      router.push(`/results/${project.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const isValid = form.business_idea.length >= 10 && form.target_market && form.country && form.budget;

  return (
    <div
      className="hero-gradient"
      style={{
        minHeight: "100vh",
        paddingTop: "100px",
        paddingBottom: "60px",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
      }}
    >
      <div style={{ width: "100%", maxWidth: 720, padding: "0 24px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(0,212,170,0.1)",
              border: "1px solid rgba(0,212,170,0.25)",
              borderRadius: 20,
              padding: "6px 16px",
              fontSize: 13,
              fontWeight: 600,
              color: "#00D4AA",
              marginBottom: 24,
            }}
          >
            ⚡ Agents ready to work
          </div>
          <h1
            style={{
              fontSize: "clamp(28px, 4vw, 48px)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              marginBottom: 12,
            }}
          >
            Describe Your{" "}
            <span className="gradient-text">Business Idea</span>
          </h1>
          <p style={{ color: "#8888AA", fontSize: 16 }}>
            Our 5 AI agents will analyze, brand, and strategize — all in one run.
          </p>
        </div>

        {/* Form card */}
        <div
          className="glass-card"
          style={{ padding: "40px", marginBottom: 32 }}
        >
          <form onSubmit={handleSubmit}>
            {/* Business Idea */}
            <div style={{ marginBottom: 28 }}>
              <label className="input-label" htmlFor="business_idea">
                💡 Business Idea *
              </label>
              <textarea
                id="business_idea"
                name="business_idea"
                className="input-field"
                placeholder="e.g. A SaaS platform that helps small restaurants manage their online orders, inventory, and customer loyalty programs from a single dashboard..."
                rows={5}
                value={form.business_idea}
                onChange={handleChange}
                style={{ resize: "vertical", minHeight: 120 }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: 6,
                }}
              >
                <span style={{ fontSize: 12, color: "#555577" }}>
                  Minimum 10 characters. Be specific for better results.
                </span>
                <span
                  style={{
                    fontSize: 12,
                    color: charCount >= 10 ? "#00D4AA" : "#555577",
                  }}
                >
                  {charCount}/2000
                </span>
              </div>
            </div>

            {/* Target Market */}
            <div style={{ marginBottom: 28 }}>
              <label className="input-label" htmlFor="target_market">
                🎯 Target Market *
              </label>
              <input
                id="target_market"
                name="target_market"
                className="input-field"
                type="text"
                placeholder="e.g. Small restaurant owners (1–3 locations) in urban areas"
                value={form.target_market}
                onChange={handleChange}
              />
            </div>

            {/* Country + Budget row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28 }}>
              <div>
                <label className="input-label" htmlFor="country">
                  🌍 Country *
                </label>
                <select
                  id="country"
                  name="country"
                  className="input-field"
                  value={form.country}
                  onChange={handleChange}
                  style={{ cursor: "pointer" }}
                >
                  <option value="">Select country</option>
                  {COUNTRY_OPTIONS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="input-label" htmlFor="budget">
                  💰 Startup Budget *
                </label>
                <select
                  id="budget"
                  name="budget"
                  className="input-field"
                  value={form.budget}
                  onChange={handleChange}
                  style={{ cursor: "pointer" }}
                >
                  <option value="">Select budget</option>
                  {BUDGET_OPTIONS.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                style={{
                  padding: "12px 16px",
                  background: "rgba(255,101,132,0.1)",
                  border: "1px solid rgba(255,101,132,0.25)",
                  borderRadius: 10,
                  color: "#FF6584",
                  fontSize: 14,
                  marginBottom: 24,
                }}
              >
                ⚠️ {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="btn-primary"
              disabled={loading || !isValid}
              style={{
                width: "100%",
                fontSize: 16,
                padding: "16px",
                opacity: loading || !isValid ? 0.6 : 1,
                cursor: loading || !isValid ? "not-allowed" : "pointer",
                position: "relative",
                zIndex: 1,
              }}
            >
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                  <span style={{
                    width: 16,
                    height: 16,
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderTopColor: "white",
                    borderRadius: "50%",
                    display: "inline-block",
                    animation: "spin-slow 0.8s linear infinite",
                  }} />
                  Starting agents...
                </span>
              ) : (
                "🚀 Launch AI Agents →"
              )}
            </button>
          </form>
        </div>

        {/* Agent pipeline preview */}
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <p style={{ fontSize: 13, color: "#555577", marginBottom: 16 }}>
            The following agents will run in sequence:
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
            {AGENT_META.map((agent, i) => (
              <div key={agent.name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    background: `${agent.color}12`,
                    border: `1px solid ${agent.color}25`,
                    borderRadius: 20,
                    padding: "4px 12px",
                    fontSize: 13,
                    color: agent.color,
                    fontWeight: 500,
                  }}
                >
                  {agent.icon} {agent.label}
                </div>
                {i < AGENT_META.length - 1 && (
                  <span style={{ color: "#333355", fontSize: 12 }}>→</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
