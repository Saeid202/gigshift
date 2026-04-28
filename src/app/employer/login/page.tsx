"use client";
import { useState } from "react";
import { signIn } from "../actions";
import { Zap } from "lucide-react";

export default function EmployerLogin() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const result = await signIn(fd);
    if (result?.error) { setError(result.error); setLoading(false); }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center", marginBottom: 32 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#7c3aed,#4f46e5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Zap size={17} color="#fff" fill="#fff" />
          </div>
          <span style={{ fontSize: 20, fontWeight: 800, color: "#111827" }}>Gig<span style={{ color: "#7c3aed" }}>Shift</span></span>
        </div>

        {/* Card */}
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 20, padding: "40px 36px", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111827", marginBottom: 6 }}>Employer Sign In</h1>
          <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 28 }}>Welcome back — sign in to your dashboard</p>

          {error && (
            <div style={{ padding: "10px 14px", borderRadius: 8, background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", fontSize: 13, marginBottom: 20 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Email</label>
              <input name="email" type="email" required placeholder="you@company.com"
                style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1px solid #d1d5db", fontSize: 14, color: "#111827", outline: "none", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Password</label>
              <input name="password" type="password" required placeholder="••••••••"
                style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1px solid #d1d5db", fontSize: 14, color: "#111827", outline: "none", boxSizing: "border-box" }} />
            </div>
            <button type="submit" disabled={loading} style={{
              marginTop: 8, padding: "13px", borderRadius: 10, fontWeight: 700, fontSize: 14,
              color: "#fff", background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
              border: "none", cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              boxShadow: "0 4px 16px rgba(124,58,237,0.3)",
            }}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p style={{ textAlign: "center", fontSize: 13, color: "#6b7280", marginTop: 24 }}>
            Don&apos;t have an account?{" "}
            <a href="/employer/signup" style={{ color: "#7c3aed", fontWeight: 600, textDecoration: "none" }}>Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
}
