"use client";
import { useState, useEffect } from "react";
import { Zap, Menu, X, LayoutDashboard, LogIn, UserPlus } from "lucide-react";
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

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  function openModal(tab: AuthTab, role?: AuthRole) {
    setAuthModal(tab); setAuthRole(role ?? null); setOpen(false);
  }

  return (
    <>
      <style>{`
        .nav-desktop { display: flex; }
        .nav-hamburger { display: none; }
        .nav-drawer { display: flex; }
        @media (max-width: 767px) {
          .nav-desktop { display: none !important; }
          .nav-hamburger { display: flex !important; }
        }
        @media (min-width: 768px) {
          .nav-drawer { display: none !important; }
        }
      `}</style>

      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? C.navyDeep : "rgba(10,22,40,0.92)",
        backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${scrolled ? C.navyBorder : "rgba(201,162,39,0.2)"}`,
        boxShadow: scrolled ? "0 4px 32px rgba(0,0,0,0.4)" : "none",
        transition: "all 0.3s ease",
        padding: "0 24px",
      }}>
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

          {/* Desktop nav links */}
          <div className="nav-desktop" style={{ alignItems: "center", gap: 32 }}>
            {["Features", "How it Works"].map(label => (
              <NavLink key={label} href={`#${label.toLowerCase().replace(/ /g, "-")}`} label={label} />
            ))}
            <button onClick={() => openModal("signup", "employer")} style={navBtnStyle} onMouseEnter={e => { e.currentTarget.style.color = C.gold; e.currentTarget.style.borderBottomColor = C.gold; }} onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.8)"; e.currentTarget.style.borderBottomColor = "transparent"; }}>For Employers</button>
            <button onClick={() => openModal("signup", "worker")} style={navBtnStyle} onMouseEnter={e => { e.currentTarget.style.color = C.gold; e.currentTarget.style.borderBottomColor = C.gold; }} onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.8)"; e.currentTarget.style.borderBottomColor = "transparent"; }}>For Workers</button>
          </div>

          {/* Desktop CTA */}
          <div className="nav-desktop" style={{ alignItems: "center", gap: 10 }}>
            <SignInBtn onClick={() => openModal("signin")} />
            <GetStartedBtn onClick={() => openModal("signup")} />
          </div>

          {/* Hamburger — mobile only */}
          <button
            className="nav-hamburger"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close menu" : "Open menu"}
            style={{ background: "none", border: "none", color: C.white, cursor: "pointer", padding: 6, borderRadius: 8, alignItems: "center", justifyContent: "center" }}
          >
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </nav>

      {/* Backdrop */}
      {open && (
        <div
          className="nav-drawer"
          onClick={() => setOpen(false)}
          style={{ position: "fixed", inset: 0, zIndex: 99, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
        />
      )}

      {/* Drawer panel — always in DOM on mobile, slides in/out */}
      <div
        className="nav-drawer"
        style={{
          position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 200,
          width: 280, flexDirection: "column",
          background: C.navyDeep,
          borderLeft: `1px solid ${C.navyBorder}`,
          transform: open ? "translateX(0)" : "translateX(110%)",
          visibility: open ? "visible" : "hidden",
          transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1), visibility 0.3s",
          boxShadow: open ? "-8px 0 40px rgba(0,0,0,0.5)" : "none",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 20px 16px", borderBottom: `1px solid ${C.navyBorder}` }}>
          <a href="/" onClick={() => setOpen(false)} style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <div style={{ width: 28, height: 28, borderRadius: 7, background: C.goldGrad, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Zap size={13} color={C.navyDeep} fill={C.navyDeep} />
            </div>
            <span style={{ fontSize: 16, fontWeight: 800, color: C.white }}>Gig<span style={{ color: C.gold }}>Shift</span></span>
          </a>
          <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", padding: 4 }}>
            <X size={20} />
          </button>
        </div>

        {/* Links */}
        <div style={{ padding: "12px 0", borderBottom: `1px solid ${C.navyBorder}` }}>
          {[{ href: "#features", label: "Features" }, { href: "#how-it-works", label: "How it Works" }].map(({ href, label }) => (
            <a key={href} href={href} onClick={() => setOpen(false)} style={{ display: "block", padding: "12px 20px", fontSize: 15, color: "rgba(255,255,255,0.75)", textDecoration: "none", fontWeight: 500 }}>
              {label}
            </a>
          ))}
          <button onClick={() => openModal("signup", "employer")} style={drawerLinkStyle}>For Employers</button>
          <button onClick={() => openModal("signup", "worker")} style={drawerLinkStyle}>For Workers</button>
        </div>

        {/* CTA */}
        <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: 10 }}>
          <button onClick={() => openModal("signin")} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", padding: "13px 0", borderRadius: 12, border: `1.5px solid ${C.navyBorder}`, background: "transparent", fontSize: 14, fontWeight: 600, color: C.white, cursor: "pointer" }}>
            <LogIn size={16} /> Sign In
          </button>
          <button onClick={() => openModal("signup")} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", padding: "13px 0", borderRadius: 12, border: "none", background: C.goldGrad, fontSize: 14, fontWeight: 700, color: C.navyDeep, cursor: "pointer" }}>
            <UserPlus size={16} /> Get Started Free
          </button>
          <a href="/employer/dashboard" onClick={() => setOpen(false)} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", padding: "13px 0", borderRadius: 12, border: `1.5px solid rgba(201,162,39,0.4)`, background: "rgba(201,162,39,0.08)", fontSize: 14, fontWeight: 600, color: C.gold, textDecoration: "none", boxSizing: "border-box" }}>
            <LayoutDashboard size={16} /> Go to Dashboard
          </a>
        </div>
      </div>

      {authModal && <AuthModal defaultTab={authModal} defaultRole={authRole ?? undefined} onClose={() => setAuthModal(null)} />}
    </>
  );
}

const navBtnStyle: React.CSSProperties = {
  fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,0.8)",
  background: "none", border: "none", borderBottom: "2px solid transparent",
  paddingBottom: 2, cursor: "pointer", transition: "all 0.2s",
};

const drawerLinkStyle: React.CSSProperties = {
  display: "block", width: "100%", padding: "12px 20px",
  fontSize: 15, color: "rgba(255,255,255,0.75)",
  background: "none", border: "none", textAlign: "left",
  cursor: "pointer", fontWeight: 500,
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
