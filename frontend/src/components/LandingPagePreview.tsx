"use client";

interface WebsiteCopy {
  hero?: {
    headline?: string;
    subheadline?: string;
    cta_primary?: string;
    cta_secondary?: string;
  };
  about?: { headline?: string; body?: string };
  features?: Array<{ title?: string; description?: string; icon?: string }>;
  footer_tagline?: string;
}

interface BrandColors {
  primary?: string;
  secondary?: string;
  accent?: string;
}

interface LandingPagePreviewProps {
  brandName?: string;
  tagline?: string;
  colors?: BrandColors;
  websiteCopy: WebsiteCopy;
}

export default function LandingPagePreview({
  brandName = "Your Brand",
  tagline,
  colors,
  websiteCopy,
}: LandingPagePreviewProps) {
  const primary = colors?.primary || "#6C63FF";
  const accent = colors?.accent || "#00D4AA";
  const hero = websiteCopy.hero ?? {};
  const features = websiteCopy.features ?? [];

  return (
    <div
      style={{
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 16,
        overflow: "hidden",
        marginBottom: 24,
        background: "#0d0d14",
      }}
    >
      <div
        style={{
          padding: "12px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: 12,
          color: "#8888AA",
        }}
      >
        <span>🌐</span> Landing Page Preview
        <span style={{ marginLeft: "auto", color: "#555577" }}>from Content Agent</span>
      </div>

      {/* Mock browser chrome */}
      <div style={{ padding: "0 0 24px" }}>
        <header
          style={{
            padding: "16px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <span style={{ fontWeight: 800, fontSize: 16, color: primary }}>{brandName}</span>
          <span style={{ fontSize: 12, color: accent, fontWeight: 600 }}>{hero.cta_primary || "Get Started"}</span>
        </header>

        <section style={{ padding: "40px 24px", textAlign: "center" }}>
          {tagline && (
            <p style={{ fontSize: 12, color: accent, fontWeight: 600, marginBottom: 12, letterSpacing: "0.05em" }}>
              {tagline}
            </p>
          )}
          <h2
            style={{
              fontSize: "clamp(20px, 3vw, 28px)",
              fontWeight: 800,
              lineHeight: 1.2,
              marginBottom: 12,
              color: "#F0F0FF",
            }}
          >
            {hero.headline || "Your headline here"}
          </h2>
          <p style={{ color: "#8888AA", fontSize: 14, maxWidth: 480, margin: "0 auto 20px", lineHeight: 1.6 }}>
            {hero.subheadline}
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <span
              style={{
                padding: "10px 20px",
                borderRadius: 8,
                background: `linear-gradient(135deg, ${primary}, ${accent})`,
                color: "white",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {hero.cta_primary || "Primary CTA"}
            </span>
            {hero.cta_secondary && (
              <span
                style={{
                  padding: "10px 20px",
                  borderRadius: 8,
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "#8888AA",
                  fontSize: 13,
                }}
              >
                {hero.cta_secondary}
              </span>
            )}
          </div>
        </section>

        {websiteCopy.about && (
          <section
            style={{
              padding: "24px",
              margin: "0 24px",
              background: "rgba(255,255,255,0.02)",
              borderRadius: 12,
            }}
          >
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: "#F0F0FF" }}>
              {websiteCopy.about.headline}
            </h3>
            <p style={{ fontSize: 13, color: "#8888AA", lineHeight: 1.6 }}>{websiteCopy.about.body}</p>
          </section>
        )}

        {features.length > 0 && (
          <section
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: 12,
              padding: 24,
            }}
          >
            {features.slice(0, 3).map((f, i) => (
              <div
                key={i}
                style={{
                  padding: 16,
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.06)",
                  background: "rgba(255,255,255,0.02)",
                }}
              >
                <div style={{ fontSize: 20, marginBottom: 8 }}>✦</div>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4, color: "#F0F0FF" }}>{f.title}</div>
                <div style={{ fontSize: 11, color: "#8888AA", lineHeight: 1.5 }}>{f.description}</div>
              </div>
            ))}
          </section>
        )}

        {websiteCopy.footer_tagline && (
          <footer
            style={{
              textAlign: "center",
              padding: "16px 24px",
              fontSize: 12,
              color: "#555577",
              borderTop: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            {websiteCopy.footer_tagline}
          </footer>
        )}
      </div>
    </div>
  );
}
