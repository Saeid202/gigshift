"use client";
import { useState } from "react";
import { Building2, User, X, Zap, Eye, EyeOff } from "lucide-react";
import { signUp, signIn } from "@/app/actions";

const BRAND = "#1e5bb5";
const GRADIENT = "linear-gradient(135deg, #c9a227 0%, #e8c547 100%)";
const TEXT = "#0a1628";
const TEXT_MUTED = "#64748b";
const BORDER = "#e2e8f0";
const WHITE = "#ffffff";
const NAVY = "#0a1628";

type Tab = "signup" | "signin";
type Role = "employer" | "worker";

export default function AuthModal({ defaultTab = "signup", defaultRole, onClose }: {
  defaultTab?: Tab; defaultRole?: Role; onClose: () => void;
}) {
  const [tab, setTab] = useState<Tab>(defaultTab);
  const [role, setRole] = useState<Role | null>(defaultRole ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPw, setShowPw] = useState(false);

  async function handleSignUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!role) { setError("Please select your role"); return; }
    setLoading(true); setError(null);
    const fd = new FormData(e.currentTarget);
    fd.set("role", role);
    const result = await signUp(fd);
    setLoading(false);
    if (result?.error) { setError(result.error); return; }
    setSuccess(true);
  }

  async function handleSignIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true); setError(null);
    const fd = new FormData(e.currentTarget);
    const result = await signIn(fd);
    setLoading(false);
    if (result?.error) setError(result.error);
  }

  function switchTab(t: Tab) {
    setTab(t); setError(null); setSuccess(false);
  }

  const inp: React.CSSProperties = {
    width: "100%", padding: "11px 14px", borderRadius: 10,
    border: `1.5px solid ${BORDER}`, fontSize: 14, color: TEXT,
    outline: "none", boxSizing: "border-box", transition: "border-color 0.15s",
  };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(15,23,42,0.6)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: WHITE, borderRadius: 24, width: "100%", maxWidth: 460, boxShadow: "0 24px 80px rgba(0,0,0,0.3)", position: "relative", overflow: "hidden" }}>
        {/* Navy header accent */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(135deg, #c9a227 0%, #e8c547 100%)" }} />

        {/* Close */}
        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "#f1f5f9", border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: TEXT_MUTED, zIndex: 1 }}>
          <X size={16} />
        </button>

        {/* Header */}
        <div style={{ padding: "28px 32px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: GRADIENT, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Zap size={14} color="#fff" fill="#fff" />
            </div>
            <span style={{ fontSize: 16, fontWeight: 800, color: TEXT, letterSpacing: "-0.5px" }}>
              Gig<span style={{ color: BRAND }}>Shift</span>
            </span>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 4, background: "#f1f5f9", borderRadius: 12, padding: 4 }}>
            {(["signup", "signin"] as Tab[]).map(t => (
              <button key={t} onClick={() => switchTab(t)} style={{ flex: 1, padding: "9px 0", borderRadius: 9, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s", background: tab === t ? GRADIENT : "transparent", color: tab === t ? WHITE : TEXT_MUTED, boxShadow: tab === t ? "0 2px 8px rgba(37,99,235,0.25)" : "none" }}>
                {t === "signup" ? "Sign Up" : "Login"}
              </button>
            ))}
          </div>
        </div>

        {/* Body — fixed height so both tabs are same size */}
        <div style={{ padding: "24px 32px 32px", minHeight: 380 }}>

          {/* ── SIGN UP ── */}
          {tab === "signup" && (
            success ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#f0fdf4", border: "2px solid #bbf7d0", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 26 }}>✓</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: TEXT, marginBottom: 8 }}>Check your email</h3>
                <p style={{ fontSize: 14, color: TEXT_MUTED, lineHeight: 1.6 }}>We sent a confirmation link. Click it to activate your account, then sign in.</p>
                <button onClick={() => switchTab("signin")} style={{ marginTop: 20, padding: "10px 24px", borderRadius: 10, border: "none", background: GRADIENT, color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                  Go to Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleSignUp} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {/* Role selector */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {([
                    { value: "employer" as Role, icon: Building2, label: "I'm an Employer" },
                    { value: "worker"   as Role, icon: User,      label: "I'm a Worker" },
                  ]).map(c => (
                    <button key={c.value} type="button" onClick={() => setRole(c.value)} style={{ padding: "14px 12px", borderRadius: 12, border: `2px solid ${role === c.value ? BRAND : BORDER}`, background: role === c.value ? "#eff6ff" : WHITE, cursor: "pointer", textAlign: "center", transition: "all 0.15s" }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: role === c.value ? GRADIENT : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px" }}>
                        <c.icon size={15} color={role === c.value ? WHITE : TEXT_MUTED} />
                      </div>
                      <p style={{ fontSize: 12, fontWeight: 700, color: TEXT, margin: 0 }}>{c.label}</p>
                    </button>
                  ))}
                </div>

                <Field label="Full Name" name="full_name" type="text" autoComplete="name" style={inp} />
                {role === "employer" && <Field label="Company Name" name="company_name" type="text" autoComplete="organization" style={inp} />}
                <Field label="Email" name="email" type="email" autoComplete="email" style={inp} />
                <PwField label="Password" name="password" autoComplete="new-password" show={showPw} onToggle={() => setShowPw(p => !p)} inp={inp} />

                {error && <Err msg={error} />}
                <Btn loading={loading} label={role === "employer" ? "Create Employer Account" : role === "worker" ? "Create Worker Account" : "Create Account"} />
              </form>
            )
          )}

          {/* ── SIGN IN ── */}
          {tab === "signin" && (
            <form onSubmit={handleSignIn} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Field label="Email" name="email" type="email" autoComplete="email" style={inp} />
              <PwField label="Password" name="password" autoComplete="current-password" show={showPw} onToggle={() => setShowPw(p => !p)} inp={inp} />
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                <input type="checkbox" style={{ width: 14, height: 14, accentColor: BRAND }} />
                <span style={{ fontSize: 13, color: TEXT_MUTED }}>Remember me</span>
              </label>
              {error && <Err msg={error} />}
              <Btn loading={loading} label="Login" />
              <p style={{ textAlign: "center", fontSize: 13, color: TEXT_MUTED, marginTop: 4 }}>
                Don&apos;t have an account?{" "}
                <button type="button" onClick={() => switchTab("signup")} style={{ background: "none", border: "none", color: BRAND, fontWeight: 600, cursor: "pointer", fontSize: 13, padding: 0 }}>Sign up</button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, name, type, autoComplete, style }: { label: string; name: string; type: string; autoComplete?: string; style: React.CSSProperties }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: TEXT, marginBottom: 6 }}>{label}</label>
      <input name={name} type={type} autoComplete={autoComplete} required
        style={{ ...style, borderColor: focused ? BRAND : BORDER }}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} />
    </div>
  );
}

function PwField({ label, name, autoComplete, show, onToggle, inp }: { label: string; name: string; autoComplete?: string; show: boolean; onToggle: () => void; inp: React.CSSProperties }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: TEXT, marginBottom: 6 }}>{label}</label>
      <div style={{ position: "relative" }}>
        <input name={name} type={show ? "text" : "password"} autoComplete={autoComplete} minLength={8} required
          style={{ ...inp, paddingRight: 42, borderColor: focused ? BRAND : BORDER }}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} />
        <button type="button" onClick={onToggle} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: TEXT_MUTED, display: "flex", alignItems: "center" }}>
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
    </div>
  );
}

function Btn({ loading, label }: { loading: boolean; label: string }) {
  return (
    <button type="submit" disabled={loading} style={{ width: "100%", padding: "12px 0", borderRadius: 12, border: "none", background: loading ? "#94a3b8" : GRADIENT, color: WHITE, fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", marginTop: 4 }}>
      {loading ? "Please wait…" : label}
    </button>
  );
}

function Err({ msg }: { msg: string }) {
  return <div style={{ padding: "10px 14px", borderRadius: 10, background: "#fef2f2", border: "1px solid #fecaca", fontSize: 13, color: "#dc2626" }}>{msg}</div>;
}
