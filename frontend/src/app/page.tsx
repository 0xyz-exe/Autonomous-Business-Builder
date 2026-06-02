import Link from "next/link";
import { AGENT_META } from "@/types";

export default function HomePage() {
  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Hero Section */}
      <section
        className="hero-gradient grid-bg"
        style={{
          paddingTop: "140px",
          paddingBottom: "100px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative orbs */}
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "15%",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(108,99,255,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "10%",
            right: "10%",
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,212,170,0.1) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px", position: "relative" }}>
          {/* Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(108,99,255,0.12)",
              border: "1px solid rgba(108,99,255,0.3)",
              borderRadius: 20,
              padding: "6px 16px",
              fontSize: 13,
              fontWeight: 600,
              color: "#8B84FF",
              marginBottom: 32,
            }}
          >
            <span>🤖</span> 5 AI Agents Working For You
          </div>

          <h1
            style={{
              fontSize: "clamp(40px, 6vw, 72px)",
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: 24,
              letterSpacing: "-0.03em",
            }}
          >
            Turn Your Idea Into a{" "}
            <span className="gradient-text">Complete Business</span>
            <br />
            In Minutes
          </h1>

          <p
            style={{
              fontSize: "clamp(16px, 2vw, 20px)",
              color: "#8888AA",
              lineHeight: 1.7,
              marginBottom: 48,
              maxWidth: 580,
              margin: "0 auto 48px",
            }}
          >
            Five specialized AI agents handle your market research, branding,
            content, sales strategy, and analytics — delivering a complete
            business package in one seamless workflow.
          </p>

          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/new-business"
              className="btn-primary"
              style={{
                display: "inline-block",
                textDecoration: "none",
                fontSize: 16,
                padding: "16px 36px",
                position: "relative",
                zIndex: 1,
              }}
            >
              🚀 Build My Business
            </Link>
            <a
              href="#how-it-works"
              className="btn-secondary"
              style={{ display: "inline-block", textDecoration: "none", fontSize: 16, padding: "16px 36px" }}
            >
              See How It Works
            </a>
          </div>

          {/* Stats row */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "48px",
              marginTop: 64,
              flexWrap: "wrap",
            }}
          >
            {[
              { value: "5", label: "AI Agents" },
              { value: "< 5 min", label: "Average Time" },
              { value: "100%", label: "Structured Output" },
            ].map((stat) => (
              <div key={stat.label} style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: 32,
                    fontWeight: 800,
                    background: "linear-gradient(135deg, #8B84FF, #00D4AA)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {stat.value}
                </div>
                <div style={{ fontSize: 13, color: "#8888AA", marginTop: 4 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        style={{ padding: "100px 24px", maxWidth: 1200, margin: "0 auto" }}
      >
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 48px)",
              fontWeight: 700,
              marginBottom: 16,
              letterSpacing: "-0.02em",
            }}
          >
            Five Agents,{" "}
            <span className="gradient-text">One Pipeline</span>
          </h2>
          <p style={{ color: "#8888AA", fontSize: 17, maxWidth: 500, margin: "0 auto" }}>
            Each agent specializes in one domain, building on the results of the previous one.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 20,
          }}
        >
          {AGENT_META.map((agent, i) => (
            <div
              key={agent.name}
              className="glass-card"
              style={{ padding: 28, position: "relative", overflow: "hidden" }}
            >
              {/* Step number */}
              <div
                style={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#555577",
                }}
              >
                {i + 1}
              </div>

              {/* Icon */}
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: `${agent.color}18`,
                  border: `1px solid ${agent.color}30`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 24,
                  marginBottom: 16,
                }}
              >
                {agent.icon}
              </div>

              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: "#F0F0FF" }}>
                {agent.label}
              </h3>
              <p style={{ fontSize: 14, color: "#8888AA", lineHeight: 1.6 }}>
                {agent.description}
              </p>

              {/* Color bar */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: 2,
                  background: `linear-gradient(90deg, ${agent.color}, transparent)`,
                }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section
        style={{
          padding: "80px 24px",
          textAlign: "center",
          background: "linear-gradient(135deg, rgba(108,99,255,0.08), rgba(0,212,170,0.05))",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 700,
              marginBottom: 16,
              letterSpacing: "-0.02em",
            }}
          >
            Ready to build your{" "}
            <span className="gradient-text-pink">next big thing?</span>
          </h2>
          <p style={{ color: "#8888AA", fontSize: 17, marginBottom: 40 }}>
            Enter your idea. Our agents handle the rest.
          </p>
          <Link
            href="/new-business"
            className="btn-primary"
            style={{
              display: "inline-block",
              textDecoration: "none",
              fontSize: 17,
              padding: "18px 48px",
              position: "relative",
              zIndex: 1,
            }}
          >
            Start Building for Free →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          textAlign: "center",
          padding: "32px 24px",
          color: "#444466",
          fontSize: 13,
        }}
      >
        © 2025 BizBuilderAI — Built with 5 specialized AI agents
      </footer>
    </div>
  );
}
