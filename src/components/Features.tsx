"use client";
import { useState } from "react";
import { Zap, Shield, Clock, BarChart3, MapPin, Bell } from "lucide-react";
import { C } from "@/lib/design";

const features = [
  { icon: Zap,       title: "Instant Matching",    desc: "Smart algorithm matches the right worker to the right shift in minutes, not days." },
  { icon: Shield,    title: "Verified Workers",     desc: "Every worker is background-checked and rated. You always know who's showing up." },
  { icon: Clock,     title: "Real-Time Scheduling", desc: "Post last minute or plan weeks ahead. GigShift handles both with ease." },
  { icon: BarChart3, title: "Analytics Dashboard",  desc: "Track fill rates, worker performance, and costs from one clean dashboard." },
  { icon: MapPin,    title: "Location-Based",       desc: "Workers see shifts near them. Employers find local talent fast." },
  { icon: Bell,      title: "Smart Notifications",  desc: "Workers get notified of matching shifts instantly. Never miss an opportunity." },
];

export default function Features() {
  return (
    <section id="features" style={{ background: C.navyDeep, padding: "80px 32px 120px", position: "relative", overflow: "hidden" }}>
      {/* Dot grid */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.03, backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none" }} />
      {/* Gold diagonal accent */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: C.goldGrad, opacity: 0.4 }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px", borderRadius: 100, background: C.goldBg, border: `1px solid rgba(201,162,39,0.4)`, fontSize: 11, fontWeight: 700, color: C.gold, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>
            <Zap size={11} color={C.gold} /> Features
          </div>
          <h2 style={{ fontSize: "clamp(28px,3.5vw,42px)", fontWeight: 900, color: C.white, letterSpacing: "-1px", lineHeight: 1.2, marginBottom: 14 }}>
            Everything you need,{" "}
            <span style={{ color: C.gold }}>nothing you don&apos;t</span>
          </h2>
          <p style={{ fontSize: 16, color: C.textMuted, maxWidth: 500, margin: "0 auto", lineHeight: 1.65 }}>
            Built for speed, reliability, and simplicity — for both sides of the marketplace.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
          {features.map(f => <FeatureCard key={f.title} f={f} />)}
        </div>
      </div>

      {/* Diagonal divider — top-left to bottom-right */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
          <path d="M0 0L1440 80V80H0V0Z" fill={C.bgLight} />
        </svg>
      </div>
    </section>
  );
}

function FeatureCard({ f }: { f: typeof features[0] }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ padding: "28px", borderRadius: 16, background: hovered ? "linear-gradient(135deg, #0d1f3c, #1a3a6b)" : "rgba(255,255,255,0.04)", border: `1px solid ${hovered ? "rgba(201,162,39,0.4)" : C.navyBorder}`, boxShadow: hovered ? "0 8px 32px rgba(0,0,0,0.3)" : "none", transition: "all 0.25s", cursor: "default", position: "relative", overflow: "hidden" }}>
      {hovered && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: C.goldGrad }} />}
      {/* Gold icon circle — like ICB */}
      <div style={{ width: 52, height: 52, borderRadius: "50%", background: C.goldBg, border: `2px solid rgba(201,162,39,0.4)`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
        <f.icon size={22} color={C.gold} />
      </div>
      <h3 style={{ fontSize: 15, fontWeight: 700, color: C.white, marginBottom: 8 }}>{f.title}</h3>
      <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
    </div>
  );
}
