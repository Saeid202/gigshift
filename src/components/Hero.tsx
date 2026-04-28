"use client";
import { useState } from "react";
import { Star, MapPin, Clock, DollarSign, CheckCircle, ArrowRight, Briefcase } from "lucide-react";
import AuthModal from "./AuthModal";
import { C } from "@/lib/design";

type AuthTab = "signup" | "signin";
type AuthRole = "employer" | "worker";

export default function Hero() {
  const [authModal, setAuthModal] = useState<AuthTab | null>(null);
  const [authRole, setAuthRole] = useState<AuthRole | null>(null);
  function openModal(role: AuthRole) { setAuthRole(role); setAuthModal("signup"); }

  return (
    <>
      <section style={{ background: C.heroGrad, position: "relative", overflow: "hidden", minHeight: "100vh", display: "flex", alignItems: "center" }}>
        {/* Dot grid overlay */}
        <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none" }} />
        {/* Gold diagonal accent lines */}
        <div style={{ position: "absolute", top: 0, right: 0, width: 300, height: "100%", pointerEvents: "none", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -20, right: -20, width: 3, height: "140%", background: C.goldGrad, transform: "rotate(-15deg)", opacity: 0.6 }} />
          <div style={{ position: "absolute", top: -20, right: 40, width: 1, height: "140%", background: C.goldGrad, transform: "rotate(-15deg)", opacity: 0.3 }} />
        </div>
        {/* Glow blobs */}
        <div style={{ position: "absolute", top: -100, left: -100, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(30,91,181,0.3) 0%, transparent 70%)", filter: "blur(60px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -80, right: 200, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,162,39,0.15) 0%, transparent 70%)", filter: "blur(60px)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "120px 32px 100px", width: "100%", position: "relative", zIndex: 1 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>

            {/* LEFT */}
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 100, background: "rgba(201,162,39,0.15)", border: `1px solid rgba(201,162,39,0.4)`, fontSize: 12, fontWeight: 600, color: C.gold, marginBottom: 28 }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ade80", display: "inline-block" }} />
                Now live — 10,000+ workers ready
              </div>

              <h1 style={{ fontSize: "clamp(40px, 5vw, 64px)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-2px", color: C.white, marginBottom: 24 }}>
                Find Shifts.<br />
                <span style={{ color: C.gold }}>Get Paid.</span><br />
                Build Your Future.
              </h1>

              <p style={{ fontSize: 18, color: "rgba(255,255,255,0.7)", lineHeight: 1.7, maxWidth: 460, marginBottom: 40 }}>
                GigShift connects businesses with verified flexible workers instantly. Post a shift, get matched, show up, get paid.
              </p>

              <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 48 }}>
                <HeroBtn label="Post a Shift" primary onClick={() => openModal("employer")} />
                <HeroBtn label="Find Work Near You" onClick={() => openModal("worker")} />
              </div>

              {/* Social proof */}
              <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ display: "flex" }}>
                    {[C.navyLight, C.gold, "#4ade80", C.goldLight].map((bg, i) => (
                      <div key={i} style={{ width: 32, height: 32, borderRadius: "50%", background: bg, border: "2px solid rgba(255,255,255,0.2)", marginLeft: i > 0 ? -10 : 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: C.navyDeep }}>
                        {String.fromCharCode(65 + i)}
                      </div>
                    ))}
                  </div>
                  <div>
                    <div style={{ display: "flex", gap: 1 }}>{[...Array(5)].map((_, i) => <Star key={i} size={11} fill={C.gold} color={C.gold} />)}</div>
                    <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", margin: "2px 0 0" }}>Trusted by 10k+ workers</p>
                  </div>
                </div>
                <div style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(255,255,255,0.2)" }} />
                <div style={{ padding: "5px 12px", borderRadius: 8, fontSize: 12, fontWeight: 700, background: "rgba(201,162,39,0.15)", border: `1px solid rgba(201,162,39,0.4)`, color: C.gold }}>98% shift fill rate</div>
                <div style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(255,255,255,0.2)" }} />
                <div style={{ padding: "5px 12px", borderRadius: 8, fontSize: 12, fontWeight: 700, background: "rgba(30,91,181,0.2)", border: `1px solid rgba(30,91,181,0.4)`, color: "#93c5fd" }}>4 min avg match</div>
              </div>
            </div>

            {/* RIGHT — ICB-themed floating cards */}
            <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
              {/* Main card — navy premium style */}
              <div style={{ background: "linear-gradient(135deg, #0d1f3c 0%, #1a3a6b 100%)", borderRadius: 20, padding: "28px", width: 300, boxShadow: "0 24px 64px rgba(0,0,0,0.5)", position: "relative", zIndex: 2, border: `1px solid ${C.navyBorder}` }}>
                {/* Gold top accent */}
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, borderRadius: "20px 20px 0 0", background: C.goldGrad }} />
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                  <div>
                    <p style={{ fontSize: 10, fontWeight: 700, color: C.gold, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>New Shift Available</p>
                    <p style={{ fontSize: 17, fontWeight: 800, color: C.white }}>Warehouse Associate</p>
                  </div>
                  <div style={{ width: 42, height: 42, borderRadius: 10, background: C.goldBg, border: `1px solid rgba(201,162,39,0.3)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Briefcase size={18} color={C.gold} />
                  </div>
                </div>
                {[
                  { icon: MapPin,     text: "Toronto, ON" },
                  { icon: Clock,      text: "Today, 2PM – 8PM" },
                  { icon: DollarSign, text: "$22.00 / hr" },
                ].map(row => (
                  <div key={row.text} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 7, background: C.goldBg, border: `1px solid rgba(201,162,39,0.2)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <row.icon size={13} color={C.gold} />
                    </div>
                    <span style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", fontWeight: 500 }}>{row.text}</span>
                  </div>
                ))}
                <button style={{ marginTop: 10, width: "100%", padding: "11px 0", borderRadius: 10, background: C.goldGrad, color: C.navyDeep, fontWeight: 800, fontSize: 13, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                  Accept Shift <ArrowRight size={14} />
                </button>
              </div>

              {/* Floating: confirmed */}
              <div style={{ position: "absolute", top: -24, right: -24, background: C.navyDeep, border: `1px solid ${C.navyBorder}`, borderRadius: 14, padding: "12px 16px", boxShadow: "0 8px 32px rgba(0,0,0,0.4)", display: "flex", alignItems: "center", gap: 10, zIndex: 3, animation: "floatUp 4s ease-in-out infinite" }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: C.goldBg, border: `1px solid rgba(201,162,39,0.3)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <CheckCircle size={17} color={C.gold} />
                </div>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 700, color: C.white, margin: 0 }}>Shift Confirmed!</p>
                  <p style={{ fontSize: 10, color: C.textMuted, margin: 0 }}>Today at 2:00 PM</p>
                </div>
              </div>

              {/* Floating: earnings */}
              <div style={{ position: "absolute", bottom: -20, left: -28, background: "linear-gradient(135deg, #0d1f3c, #1a3a6b)", border: `1px solid ${C.navyBorder}`, borderRadius: 14, padding: "14px 20px", boxShadow: "0 8px 32px rgba(0,0,0,0.4)", zIndex: 3, animation: "floatDown 5s ease-in-out infinite" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.gold }} />
                  <p style={{ fontSize: 10, color: C.textMuted, margin: 0 }}>This week</p>
                </div>
                <p style={{ fontSize: 20, fontWeight: 900, color: C.gold, margin: "4px 0 0" }}>$482.50 earned</p>
              </div>

              {/* Glow behind card */}
              <div style={{ position: "absolute", inset: -40, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,162,39,0.1) 0%, transparent 70%)", filter: "blur(30px)", zIndex: 1 }} />
            </div>
          </div>
        </div>

        {/* Diagonal wave divider — top-right to bottom-left */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
            <path d="M0 100L1440 20V100H0Z" fill={C.bgLight} />
            <path d="M0 100L1440 40V100H0Z" fill={C.bgLight} opacity="0.5" />
          </svg>
        </div>

        <style>{`
          @keyframes floatUp { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
          @keyframes floatDown { 0%,100%{transform:translateY(0)} 50%{transform:translateY(8px)} }
        `}</style>
      </section>

      {/* Stats bar */}
      <section style={{ background: C.bgLight, padding: "48px 32px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ background: C.navyDeep, borderRadius: 20, border: `1px solid ${C.navyBorder}`, padding: "32px 40px", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 0 }}>
            {[
              { num: "10,000+", label: "Active Workers" },
              { num: "98%",     label: "Shift Fill Rate" },
              { num: "4 min",   label: "Avg Match Time" },
              { num: "500+",    label: "Businesses" },
            ].map((s, i) => (
              <div key={s.label} style={{ textAlign: "center", borderRight: i < 3 ? `1px solid ${C.navyBorder}` : "none", padding: "0 24px" }}>
                <div style={{ fontSize: "clamp(22px,3vw,30px)", fontWeight: 900, color: C.gold, marginBottom: 4 }}>{s.num}</div>
                <div style={{ fontSize: 13, color: C.textMuted, fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {authModal && <AuthModal defaultTab={authModal} defaultRole={authRole ?? undefined} onClose={() => setAuthModal(null)} />}
    </>
  );
}

function HeroBtn({ label, primary, onClick }: { label: string; primary?: boolean; onClick: () => void }) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick} style={{ padding: "14px 28px", fontSize: 15, fontWeight: primary ? 800 : 600, borderRadius: 12, cursor: "pointer", background: primary ? C.goldGrad : "rgba(255,255,255,0.08)", color: primary ? C.navyDeep : C.white, border: primary ? "none" : `1.5px solid rgba(255,255,255,0.25)`, boxShadow: primary ? (h ? "0 12px 32px rgba(201,162,39,0.5)" : "0 8px 24px rgba(201,162,39,0.3)") : "none", transform: h ? "translateY(-2px)" : "translateY(0)", transition: "all 0.2s", display: "flex", alignItems: "center", gap: 8 }}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}>
      {label} {primary && <ArrowRight size={15} />}
    </button>
  );
}
