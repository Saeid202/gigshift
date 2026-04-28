"use client";
import { useState, useEffect } from "react";
import { Zap, Menu, X } from "lucide-react";
import AuthModal from "./AuthModal";
import { C } from "@/lib/design";

type AuthTab = "signup" | "signin";
type AuthRole = "employer" | "worker";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [authModal, setAuthModal] = useState<AuthTab | null>(null);
  const [authRole, setAuthRole] = useState<AuthRole | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function openModal(tab: AuthTab, role?: AuthRole) {
    setAuthModal(tab); setAuthRole(role ?? null); setOpen(false);
  }

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? C.navyDeep : "rgba(10,22,40,0.92)",
        backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${scrolled ? C.navyBorder : "rgba(201,162,39,0.2)"}`,
        boxShadow: scrolled ? "0 4px 32px rgba(0,0,0,0.4)" : "none",
        transition: "all 0.3s ease",
        padding: "0 32px",
      }}>
        {/* Gold accent line at bottom */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: C.goldGrad, opacity: scrolled ? 1 : 0.6, transition: "opacity 0.3s" }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", height: 68, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Logo */}
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: C.goldGrad, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Zap size={16} color={C.navyDeep} fill={C.navyDeep} />
            </div>
            <span style={{ fontSize: 19, fontWeight: 800, color: C.white, letterSpacing: "-0.5px" }}>
              Gig<span style={{ color: C.gold }}>Shift</span>
            </span>
          </a>

          {/* Desktop nav */}
          <div style={{ display: "flex", alignItems: "center", gap: 32 }} className="hidden md:flex">
            {["Features", "How it Works"].map(label => (
              <NavLink key={label} href={`#${label.toLowerCase().replace(/ /g, "-")}`} label={label} />
            ))}
            <button onClick={() => openModal("signup", "employer")} style={navBtnStyle} onMouseEnter={e => { e.currentTarget.style.color = C.gold; e.currentTarget.style.borderBottomColor = C.gold; }} onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.8)"; e.currentTarget.style.borderBottomColor = "transparent"; }}>For Employers</button>
            <button onClick={() => openModal("signup", "worker")} style={navBtnStyle} onMouseEnter={e => { e.currentTarget.style.color = C.gold; e.currentTarget.style.borderBottomColor = C.gold; }} onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.8)"; e.currentTarget.style.borderBottomColor = "transparent"; }}>For Workers</button>
          </div>

          {/* CTA */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }} className="hidden md:flex">
            <SignInBtn onClick={() => openModal("signin")} />
            <GetStartedBtn onClick={() => openModal("signup")} />
          </div>

          <button onClick={() => setOpen(!open)} style={{ background: "none", border: "none", color: C.white, cursor: "pointer", padding: 4 }} className="md:hidden">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div style={{ background: C.navyDeep, borderTop: `1px solid ${C.navyBorder}`, padding: "16px 0 20px", display: "flex", flexDirection: "column", gap: 4 }}>
            {["#features", "#how-it-works"].map((href, i) => (
              <a key={href} href={href} onClick={() => setOpen(false)} style={{ padding: "10px 16px", fontSize: 14, color: "rgba(255,255,255,0.8)", textDecoration: "none", fontWeight: 500 }}>
                {["Features", "How it Works"][i]}
              </a>
            ))}
            <button onClick={() => openModal("signup", "employer")} style={{ padding: "10px 16px", fontSize: 14, color: "rgba(255,255,255,0.8)", background: "none", border: "none", textAlign: "left", cursor: "pointer" }}>For Employers</button>
            <button onClick={() => openModal("signup", "worker")} style={{ padding: "10px 16px", fontSize: 14, color: "rgba(255,255,255,0.8)", background: "none", border: "none", textAlign: "left", cursor: "pointer" }}>For Workers</button>
            <div style={{ display: "flex", gap: 10, padding: "10px 16px 0" }}>
              <button onClick={() => openModal("signin")} style={{ flex: 1, padding: "10px 0", borderRadius: 10, border: `1.5px solid ${C.navyBorder}`, background: "transparent", fontSize: 13, fontWeight: 600, color: C.white, cursor: "pointer" }}>Sign In</button>
              <button onClick={() => openModal("signup")} style={{ flex: 1, padding: "10px 0", borderRadius: 10, border: "none", background: C.goldGrad, fontSize: 13, fontWeight: 700, color: C.navyDeep, cursor: "pointer" }}>Get Started</button>
            </div>
          </div>
        )}
      </nav>

      {authModal && <AuthModal defaultTab={authModal} defaultRole={authRole ?? undefined} onClose={() => setAuthModal(null)} />}
    </>
  );
}

const navBtnStyle: React.CSSProperties = {
  fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,0.8)",
  background: "none", border: "none", borderBottom: "2px solid transparent",
  paddingBottom: 2, cursor: "pointer", transition: "all 0.2s",
};

function NavLink({ href, label }: { href: string; label: string }) {
  const [h, setH] = useState(false);
  return (
    <a href={href} style={{ fontSize: 14, fontWeight: 500, textDecoration: "none", color: h ? C.gold : "rgba(255,255,255,0.8)", borderBottom: h ? `2px solid ${C.gold}` : "2px solid transparent", paddingBottom: 2, transition: "color 0.2s" }}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}>{label}</a>
  );
}

function SignInBtn({ onClick }: { onClick: () => void }) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick} style={{ border: `1.5px solid ${h ? C.gold : C.navyBorder}`, borderRadius: 10, padding: "8px 18px", fontSize: 13, fontWeight: 600, color: h ? C.gold : C.white, background: "transparent", cursor: "pointer", transition: "all 0.2s" }}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}>Sign In</button>
  );
}

function GetStartedBtn({ onClick }: { onClick: () => void }) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick} style={{ background: C.goldGrad, color: C.navyDeep, borderRadius: 10, padding: "8px 20px", fontSize: 13, fontWeight: 800, border: "none", cursor: "pointer", boxShadow: h ? "0 6px 20px rgba(201,162,39,0.5)" : "0 4px 14px rgba(201,162,39,0.3)", transform: h ? "scale(1.03)" : "scale(1)", transition: "all 0.2s" }}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}>Get Started Free</button>
  );
}
