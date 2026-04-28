"use client";
import { useState } from "react";
import { Star, MapPin, Clock, DollarSign, CheckCircle, ArrowRight } from "lucide-react";
import AuthModal from "./AuthModal";

type AuthTab = "signup" | "signin";
type AuthRole = "employer" | "worker";

const GRADIENT = "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)";
const BRAND = "#2563eb";

export default function Hero() {
  const [authModal, setAuthModal] = useState<AuthTab | null>(null);
  const [authRole, setAuthRole] = useState<AuthRole | null>(null);

  function openModal(role: AuthRole) { setAuthRole(role); setAuthModal("signup"); }

  return (
    <>
      <section style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #2563eb 100%)",
        position: "relative", overflow: "hidden", minHeight: "100vh",
        display: "flex", alignItems: "center",
      }}>
        {/* Background blobs */}
        <div style={{ position: "absolute", top: -100, left: -100, width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(37,99,235,0.3) 0%, transparent 70%)", filter: "blur(60px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -80, right: -80, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.25) 0%, transparent 70%)", filter: "blur(60px)", pointerEvents: "none" }} />
        {/* Dot grid */}
        <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "120px 32px 80px", width: "100%", position: "relative", zIndex: 1 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>

            {/* LEFT */}
            <div>
              {/* Badge */}
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 100, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.9)", marginBottom: 28 }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ade80", display: "inline-block", animation: "pulse 2s infinite" }} />
                Now live — 10,000+ workers ready
              </div>

              <h1 style={{ fontSize: "clamp(40px, 5vw, 64px)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-2px", color: "#fff", marginBottom: 24 }}>
                Find Shifts.<br />
                <span style={{ color: "#93c5fd" }}>Get Paid.</span><br />
                Build Your Future.
              </h1>

              <p style={{ fontSize: 18, color: "rgba(255,255,255,0.7)", lineHeight: 1.7, maxWidth: 460, marginBottom: 40 }}>
                GigShift connects businesses with verified flexible workers instantly. Post a shift, get matched, show up, get paid.
              </p>

              {/* CTAs */}
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 48 }}>
                <HeroBtn label="Post a Shift" primary onClick={() => openModal("employer")} />
                <HeroBtn label="Find Work Near You" onClick={() => openModal("worker")} />
              </div>

              {/* Social proof */}
              <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ display: "flex" }}>
                    {["#60a5fa","#818cf8","#a78bfa","#34d399"].map((bg, i) => (
                      <div key={i} style={{ width: 32, height: 32, borderRadius: "50%", background: bg, border: "2px solid rgba(255,255,255,0.3)", marginLeft: i > 0 ? -10 : 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff" }}>
                        {String.fromCharCode(65 + i)}
                      </div>
                    ))}
                  </div>
                  <div>
                    <div style={{ display: "flex", gap: 1 }}>
                      {[...Array(5)].map((_, i) => <Star key={i} size={11} fill="#fbbf24" color="#fbbf24" />)}
                    </div>
                    <p style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", margin: "2px 0 0" }}>Trusted by 10k+ workers</p>
                  </div>
                </div>
                <div style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(255,255,255,0.3)" }} />
                <div style={{ padding: "5px 12px", borderRadius: 8, fontSize: 12, fontWeight: 700, background: "rgba(74,222,128,0.15)", border: "1px solid rgba(74,222,128,0.3)", color: "#4ade80" }}>
                  98% shift fill rate
                </div>
                <div style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(255,255,255,0.3)" }} />
                <div style={{ padding: "5px 12px", borderRadius: 8, fontSize: 12, fontWeight: 700, background: "rgba(147,197,253,0.15)", border: "1px solid rgba(147,197,253,0.3)", color: "#93c5fd" }}>
                  4 min avg match
                </div>
              </div>
            </div>

            {/* RIGHT — floating UI mockup */}
            <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
              {/* Main shift card */}
              <div style={{ background: "#fff", borderRadius: 20, padding: "24px", width: 300, boxShadow: "0 24px 64px rgba(0,0,0,0.3)", position: "relative", zIndex: 2 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 600, color: BRAND, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>New Shift Available</p>
                    <p style={{ fontSize: 17, fontWeight: 800, color: "#0f172a" }}>Warehouse Associate</p>
                  </div>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg,#2563eb,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>💼</div>
                </div>
                {[
                  { icon: MapPin,     text: "Toronto, ON" },
                  { icon: Clock,      text: "Today, 2PM – 8PM" },
                  { icon: DollarSign, text: "$22.00 / hr" },
                ].map(row => (
                  <div key={row.text} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 7, background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <row.icon size={13} color={BRAND} />
                    </div>
                    <span style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>{row.text}</span>
                  </div>
                ))}
                <button style={{ marginTop: 8, width: "100%", padding: "11px 0", borderRadius: 10, background: GRADIENT, color: "#fff", fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                  Accept Shift <ArrowRight size={14} />
                </button>
              </div>

              {/* Floating: confirmed notification */}
              <div style={{ position: "absolute", top: -20, right: -30, background: "#fff", borderRadius: 14, padding: "12px 16px", boxShadow: "0 8px 32px rgba(0,0,0,0.2)", display: "flex", alignItems: "center", gap: 10, zIndex: 3, animation: "floatUp 4s ease-in-out infinite" }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <CheckCircle size={17} color="#16a34a" />
                </div>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 700, color: "#0f172a", margin: 0 }}>Shift Confirmed!</p>
                  <p style={{ fontSize: 10, color: "#64748b", margin: 0 }}>Today at 2:00 PM</p>
                </div>
              </div>

              {/* Floating: earnings pill */}
              <div style={{ position: "absolute", bottom: -16, left: -24, background: GRADIENT, borderRadius: 14, padding: "12px 18px", boxShadow: "0 8px 32px rgba(37,99,235,0.4)", zIndex: 3, animation: "floatDown 5s ease-in-out infinite" }}>
                <p style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", margin: "0 0 2px" }}>This week</p>
                <p style={{ fontSize: 18, fontWeight: 900, color: "#fff", margin: 0 }}>$482.50 earned</p>
              </div>

              {/* Background glow */}
              <div style={{ position: "absolute", inset: -40, borderRadius: "50%", background: "radial-gradient(circle, rgba(37,99,235,0.2) 0%, transparent 70%)", filter: "blur(30px)", zIndex: 1 }} />
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
            <path d="M0 80L60 70C120 60 240 40 360 30C480 20 600 20 720 25C840 30 960 40 1080 45C1200 50 1320 50 1380 50L1440 50V80H0Z" fill="#f8fafc" />
          </svg>
        </div>

        <style>{`
          @keyframes floatUp { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
          @keyframes floatDown { 0%,100%{transform:translateY(0)} 50%{transform:translateY(8px)} }
          @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.4)} }
        `}</style>
      </section>

      {/* Stats bar */}
      <section style={{ background: "#f8fafc", padding: "48px 32px", borderBottom: "1px solid #e2e8f0" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #e2e8f0", padding: "32px 40px", boxShadow: "0 4px 24px rgba(0,0,0,0.06)", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 0 }}>
            {[
              { num: "10,000+", label: "Active Workers" },
              { num: "98%",     label: "Shift Fill Rate" },
              { num: "4 min",   label: "Avg Match Time" },
              { num: "500+",    label: "Businesses" },
            ].map((s, i) => (
              <div key={s.label} style={{ textAlign: "center", borderRight: i < 3 ? "1px solid #e2e8f0" : "none", padding: "0 24px" }}>
                <div style={{ fontSize: "clamp(22px,3vw,30px)", fontWeight: 900, background: GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", marginBottom: 4 }}>
                  {s.num}
                </div>
                <div style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>{s.label}</div>
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
    <button onClick={onClick} style={{ padding: "14px 28px", fontSize: 15, fontWeight: primary ? 700 : 600, borderRadius: 12, cursor: "pointer", background: primary ? "#fff" : "rgba(255,255,255,0.1)", color: primary ? "#1e3a8a" : "#fff", border: primary ? "none" : "1.5px solid rgba(255,255,255,0.3)", boxShadow: primary ? (h ? "0 12px 32px rgba(0,0,0,0.25)" : "0 8px 24px rgba(0,0,0,0.2)") : "none", transform: h ? "translateY(-2px)" : "translateY(0)", transition: "all 0.2s", display: "flex", alignItems: "center", gap: 8 }}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}>
      {label} {primary && <ArrowRight size={15} />}
    </button>
  );
}
