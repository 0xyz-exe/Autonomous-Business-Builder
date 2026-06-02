"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        padding: "0 24px",
        height: "64px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "rgba(10, 10, 15, 0.8)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Logo */}
      <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: "linear-gradient(135deg, #6C63FF, #00D4AA)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
          }}
        >
          🤖
        </div>
        <span style={{ fontWeight: 700, fontSize: 16, color: "#F0F0FF" }}>
          Biz<span style={{ color: "#6C63FF" }}>Builder</span>
          <span style={{ color: "#00D4AA" }}>AI</span>
        </span>
      </Link>

      {/* Nav links */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <Link
          href="/"
          style={{
            padding: "6px 14px",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 500,
            color: pathname === "/" ? "#8B84FF" : "#8888AA",
            background: pathname === "/" ? "rgba(108, 99, 255, 0.1)" : "transparent",
            textDecoration: "none",
            transition: "all 0.2s ease",
          }}
        >
          Home
        </Link>
        <Link
          href="/projects"
          style={{
            padding: "6px 14px",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 500,
            color: pathname === "/projects" ? "#8B84FF" : "#8888AA",
            background: pathname === "/projects" ? "rgba(108, 99, 255, 0.1)" : "transparent",
            textDecoration: "none",
            transition: "all 0.2s ease",
          }}
        >
          Projects
        </Link>
        <Link
          href="/new-business"
          style={{
            padding: "8px 18px",
            borderRadius: 10,
            fontSize: 14,
            fontWeight: 600,
            color: "white",
            background: "linear-gradient(135deg, #6C63FF, #4F47E0)",
            textDecoration: "none",
            transition: "all 0.2s ease",
            boxShadow: "0 4px 12px rgba(108,99,255,0.3)",
          }}
        >
          + New Business
        </Link>
      </div>
    </nav>
  );
}
