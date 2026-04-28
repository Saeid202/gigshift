"use client";
import { Zap } from "lucide-react";
import { C } from "@/lib/design";

export default function Footer() {
  return (
    <footer style={{ background: "#060e1a", borderTop: `1px solid ${C.navyBorder}`, padding: "48px 32px 32px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 24, marginBottom: 32 }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: C.goldGrad, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Zap size={14} color={C.navyDeep} fill={C.navyDeep} />
            </div>
            <span style={{ fontSize: 17, fontWeight: 800, color: C.white, letterSpacing: "-0.5px" }}>
              Gig<span style={{ color: C.gold }}>Shift</span>
            </span>
          </a>
          <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
            {["Features", "How it Works", "Privacy", "Terms"].map(l => (
              <a key={l} href="#" style={{ fontSize: 13, color: C.textMuted, textDecoration: "none", transition: "color 0.15s" }}
                onMouseEnter={e => (e.currentTarget.style.color = C.gold)}
                onMouseLeave={e => (e.currentTarget.style.color = C.textMuted)}>{l}</a>
            ))}
          </div>
        </div>
        {/* Gold divider line */}
        <div style={{ height: 1, background: C.goldGrad, opacity: 0.3, marginBottom: 24 }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <p style={{ fontSize: 12, color: "#475569" }}>© 2025 GigShift. All rights reserved.</p>
          <p style={{ fontSize: 12, color: "#475569" }}>Built for the future of flexible work.</p>
        </div>
      </div>
    </footer>
  );
}
