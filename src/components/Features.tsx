"use client";
import { useState } from "react";
import { Zap, Shield, Clock, BarChart3, MapPin, Bell } from "lucide-react";

const BRAND = "#2563eb";
const GRADIENT = "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)";

const features = [
  { icon: Zap,       title: "Instant Matching",    desc: "Smart algorithm matches the right worker to the right shift in minutes, not days.",  color: "#2563eb", bg: "#eff6ff", hoverBg: "#2563eb" },
  { icon: Shield,    title: "Verified Workers",     desc: "Every worker is background-checked and rated. You always know who's showing up.",    color: "#7c3aed", bg: "#f5f3ff", hoverBg: "#7c3aed" },
  { icon: Clock,     title: "Real-Time Scheduling", desc: "Post last minute or plan weeks ahead. GigShift handles both with ease.",             color: "#0891b2", bg: "#ecfeff", hoverBg: "#0891b2" },
  { icon: BarChart3, title: "Analytics Dashboard",  desc: "Track fill rates, worker performance, and costs from one clean dashboard.",          color: "#2563eb", bg: "#eff6ff", hoverBg: "#2563eb" },
  { icon: MapPin,    title: "Location-Based",       desc: "Workers see shifts near them. Employers find local talent fast.",                    color: "#7c3aed", bg: "#f5f3ff", hoverBg: "#7c3aed" },
  { icon: Bell,      title: "Smart Notifications",  desc: "Workers get notified of matching shifts instantly. Never miss an opportunity.",      color: "#0891b2", bg: "#ecfeff", hoverBg: "#0891b2" },
];

export default function Features() {
  return (
    <section id="features" style={{ background: "#f8fafc", padding: "80px 32px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px", borderRadius: 100, background: "#eff6ff", border: "1px solid #bfdbfe", fontSize: 11, fontWeight: 700, color: BRAND, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>
            <Zap size={11} /> Features
          </div>
          <h2 style={{ fontSize: "clamp(28px,3.5vw,42px)", fontWeight: 900, color: "#0f172a", letterSpacing: "-1px", lineHeight: 1.2, marginBottom: 14 }}>
            Everything you need,{" "}
            <span style={{ background: GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>nothing you don&apos;t</span>
          </h2>
          <p style={{ fontSize: 16, color: "#64748b", maxWidth: 500, margin: "0 auto", lineHeight: 1.65 }}>
            Built for speed, reliability, and simplicity — for both sides of the marketplace.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
          {features.map(f => (
            <FeatureCard key={f.title} f={f} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ f }: { f: typeof features[0] }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "28px", borderRadius: 16, background: "#fff",
        border: `1px solid ${hovered ? "#bfdbfe" : "#e2e8f0"}`,
        boxShadow: hovered ? "0 8px 32px rgba(37,99,235,0.1)" : "0 1px 6px rgba(0,0,0,0.04)",
        transition: "all 0.25s", cursor: "default",
      }}
    >
      <div style={{ width: 46, height: 46, borderRadius: 12, background: hovered ? f.hoverBg : f.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16, transition: "background 0.25s" }}>
        <f.icon size={20} color={hovered ? "#fff" : f.color} />
      </div>
      <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>{f.title}</h3>
      <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
    </div>
  );
}

// useState already imported at top
