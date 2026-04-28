"use client";
import { useState, useEffect } from "react";
import { Zap, Menu, X } from "lucide-react";
import AuthModal from "./AuthModal";

type AuthTab = "signup" | "signin";
type AuthRole = "employer" | "worker";

const GRADIENT = "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)";

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

  const textColor = scrolled ? "#0f172a" : "#ffffff";
  const mutedColor = scrolled ? "#64748b" : "rgba(255,255,255,0.8)";

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? "#ffffff" : "transparent",
        borderBottom: scrolled ? "1px solid #e2e8f0" : "none",
        boxShadow: scrolled ? "0 4px 24px rgba(37,99,235,0.1)" : "none",
        transition: "all 0.3s ease",
        padding: "0 32px",
      }}>
        {/* Gradient accent line — only when scrolled */}
        {scrolled && (
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: GRADIENT }} />
        )}

        <div style={{ maxWidth: 1200, margin: "0 auto", height: 68, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Logo */}
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: GRADIENT, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Zap size={16} color="#fff" fill="#fff" />
            </div>
            <span style={{ fontSize: 19, fontWeight: 800, color: textColor, letterSpacing: "-0.5px", transition: "color 0.3s" }}>
              Gig<span style={{ color: scrolled ? "#2563eb" : "#93c5fd" }}>Shift</span>
            </span>
          </a>

          {/* Desktop nav */}
          <div style={{ display: "flex", alignItems: "center", gap: 32 }} className="hidden md:flex">
            {["Features", "How it Works"].map(label => (
              <NavLink key={label} href={`#${label.toLowerCase().replace(/ /g, "-")}`} label={label} muted={mutedColor} active={scrolled ? "#0f172a" : "#fff"} />
            ))}
            <button onClick={() => openModal("signup", "employer")} style={{ fontSize: 14, fontWeight: 500, color: mutedColor, background: "none", border: "none", borderBottom: "2px solid transparent", paddingBottom: 2, cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.color = scrolled ? "#0f172a" : "#fff"; e.currentTarget.style.borderBottomColor = "#2563eb"; }}
              onMouseLeave={e => { e.currentTarget.style.color = mutedColor; e.currentTarget.style.borderBottomColor = "transparent"; }}>
              For Employers
            </button>
            <button onClick={() => openModal("signup", "worker")} style={{ fontSize: 14, fontWeight: 500, color: mutedColor, background: "none", border: "none", borderBottom: "2px solid transparent", paddingBottom: 2, cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.color = scrolled ? "#0f172a" : "#fff"; e.currentTarget.style.borderBottomColor = "#2563eb"; }}
              onMouseLeave={e => { e.currentTarget.style.color = mutedColor; e.currentTarget.style.borderBottomColor = "transparent"; }}>
              For Workers
            </button>
          </div>

          {/* CTA */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }} className="hidden md:flex">
            <SignInBtn onClick={() => openModal("signin")} scrolled={scrolled} />
            <GetStartedBtn onClick={() => openModal("signup")} />
          </div>

          <button onClick={() => setOpen(!open)} style={{ background: "none", border: "none", color: textColor, cursor: "pointer", padding: 4, transition: "color 0.3s" }} className="md:hidden">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div style={{ background: "#fff", borderTop: "1px solid #e2e8f0", padding: "16px 0 20px", display: "flex", flexDirection: "column", gap: 4 }}>
            {["#features", "#how-it-works"].map((href, i) => (
              <a key={href} href={href} onClick={() => setOpen(false)} style={{ padding: "10px 16px", fontSize: 14, color: "#374151", textDecoration: "none", fontWeight: 500 }}>
                {["Features", "How it Works"][i]}
              </a>
            ))}
            <button onClick={() => openModal("signup", "employer")} style={{ padding: "10px 16px", fontSize: 14, color: "#374151", background: "none", border: "none", textAlign: "left", cursor: "pointer", fontWeight: 500 }}>For Employers</button>
            <button onClick={() => openModal("signup", "worker")} style={{ padding: "10px 16px", fontSize: 14, color: "#374151", background: "none", border: "none", textAlign: "left", cursor: "pointer", fontWeight: 500 }}>For Workers</button>
            <div style={{ display: "flex", gap: 10, padding: "10px 16px 0" }}>
              <button onClick={() => openModal("signin")} style={{ flex: 1, padding: "10px 0", borderRadius: 10, border: "1.5px solid #e2e8f0", background: "transparent", fontSize: 13, fontWeight: 600, color: "#0f172a", cursor: "pointer" }}>Sign In</button>
              <button onClick={() => openModal("signup")} style={{ flex: 1, padding: "10px 0", borderRadius: 10, border: "none", background: GRADIENT, fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer" }}>Get Started</button>
            </div>
          </div>
        )}
      </nav>

      {authModal && <AuthModal defaultTab={authModal} defaultRole={authRole ?? undefined} onClose={() => setAuthModal(null)} />}
    </>
  );
}

function NavLink({ href, label, muted, active }: { href: string; label: string; muted: string; active: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a href={href} style={{ fontSize: 14, fontWeight: 500, textDecoration: "none", color: hovered ? active : muted, borderBottom: hovered ? "2px solid #2563eb" : "2px solid transparent", paddingBottom: 2, transition: "color 0.2s" }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      {label}
    </a>
  );
}

function SignInBtn({ onClick, scrolled }: { onClick: () => void; scrolled: boolean }) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick} style={{ border: `1.5px solid ${h ? "#2563eb" : scrolled ? "#e2e8f0" : "rgba(255,255,255,0.4)"}`, borderRadius: 10, padding: "8px 18px", fontSize: 13, fontWeight: 600, color: h ? "#2563eb" : scrolled ? "#0f172a" : "#fff", background: h ? "#eff6ff" : "transparent", cursor: "pointer", transition: "all 0.2s" }}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}>
      Sign In
    </button>
  );
}

function GetStartedBtn({ onClick }: { onClick: () => void }) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick} style={{ background: GRADIENT, color: "#fff", borderRadius: 10, padding: "8px 20px", fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer", boxShadow: h ? "0 6px 20px rgba(37,99,235,0.45)" : "0 4px 14px rgba(37,99,235,0.3)", transform: h ? "scale(1.03)" : "scale(1)", transition: "all 0.2s" }}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}>
      Get Started Free
    </button>
  );
}
