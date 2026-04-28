"use client";
import { Zap } from "lucide-react";

const GRADIENT = "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)";

export default function Footer() {
  return (
    <footer style={{ background: "#0f172a", borderTop: "1px solid #1e293b", padding: "48px 32px 32px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 24, marginBottom: 32 }}>
          {/* Logo */}
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: GRADIENT, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Zap size={14} color="#fff" fill="#fff" />
            </div>
            <span style={{ fontSize: 17, fontWeight: 800, color: "#fff", letterSpacing: "-0.5px" }}>
              Gig<span style={{ color: "#60a5fa" }}>Shift</span>
            </span>
          </a>

          {/* Links */}
          <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
            {["Features", "How it Works", "Privacy", "Terms"].map(l => (
              <a key={l} href="#" style={{ fontSize: 13, color: "#64748b", textDecoration: "none", transition: "color 0.15s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#94a3b8")}
                onMouseLeave={e => (e.currentTarget.style.color = "#64748b")}>
                {l}
              </a>
            ))}
          </div>
        </div>

        <div style={{ paddingTop: 24, borderTop: "1px solid #1e293b", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <p style={{ fontSize: 12, color: "#475569" }}>© 2025 GigShift. All rights reserved.</p>
          <p style={{ fontSize: 12, color: "#475569" }}>Built for the future of flexible work.</p>
        </div>
      </div>
    </footer>
  );
}
