"use client";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import AuthModal from "./AuthModal";
import { C } from "@/lib/design";

type AuthTab = "signup" | "signin";
type AuthRole = "employer" | "worker";

export default function CTA() {
  const [authModal, setAuthModal] = useState<AuthTab | null>(null);
  const [authRole, setAuthRole] = useState<AuthRole | null>(null);
  function openModal(role: AuthRole) { setAuthRole(role); setAuthModal("signup"); }

  return (
    <>
      <section style={{ background: C.navyDeep, padding: "80px 32px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.03, backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none" }} />
        {/* Gold diagonal lines */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: C.goldGrad, opacity: 0.5 }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: C.goldGrad, opacity: 0.3 }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ borderRadius: 24, padding: "72px 48px", textAlign: "center", background: "linear-gradient(135deg, #0d1f3c 0%, #1a3a6b 100%)", position: "relative", overflow: "hidden", boxShadow: "0 16px 64px rgba(0,0,0,0.4)", border: `1px solid ${C.navyBorder}` }}>
            {/* Gold accent top */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: C.goldGrad }} />
            <div style={{ position: "absolute", top: -80, left: -80, width: 320, height: 320, borderRadius: "50%", background: "rgba(201,162,39,0.06)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: -60, right: -60, width: 260, height: 260, borderRadius: "50%", background: "rgba(30,91,181,0.15)", pointerEvents: "none" }} />
            {/* Diagonal accent lines */}
            <div style={{ position: "absolute", top: 0, right: 0, width: 200, height: "100%", overflow: "hidden", pointerEvents: "none" }}>
              <div style={{ position: "absolute", top: -10, right: 20, width: 2, height: "150%", background: C.goldGrad, transform: "rotate(-15deg)", opacity: 0.3 }} />
            </div>

            <div style={{ position: "relative", zIndex: 1 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: C.gold, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>✦ Join the platform</p>
              <h2 style={{ fontSize: "clamp(28px,3.5vw,48px)", fontWeight: 900, color: C.white, letterSpacing: "-1px", lineHeight: 1.15, marginBottom: 16 }}>
                Ready to shift the way<br />
                <span style={{ color: C.gold }}>work gets done?</span>
              </h2>
              <p style={{ fontSize: 16, color: "rgba(255,255,255,0.65)", marginBottom: 40, maxWidth: 440, margin: "0 auto 40px" }}>
                Join thousands of businesses and workers already using GigShift.
              </p>
              <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
                <CtaBtn label="Post Your First Shift" primary onClick={() => openModal("employer")} />
                <CtaBtn label="Find Work Near You" onClick={() => openModal("worker")} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {authModal && <AuthModal defaultTab={authModal} defaultRole={authRole ?? undefined} onClose={() => setAuthModal(null)} />}
    </>
  );
}

function CtaBtn({ label, primary, onClick }: { label: string; primary?: boolean; onClick: () => void }) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 28px", borderRadius: 12, fontWeight: primary ? 800 : 600, fontSize: 14, cursor: "pointer", background: primary ? C.goldGrad : "rgba(255,255,255,0.08)", color: primary ? C.navyDeep : C.white, border: primary ? "none" : `1.5px solid rgba(255,255,255,0.25)`, boxShadow: primary ? (h ? "0 8px 24px rgba(201,162,39,0.5)" : "0 4px 16px rgba(201,162,39,0.3)") : "none", transform: h ? "translateY(-1px)" : "translateY(0)", transition: "all 0.2s" }}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}>
      {label} {primary && <ArrowRight size={14} />}
    </button>
  );
}
