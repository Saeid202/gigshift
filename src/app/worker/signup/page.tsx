"use client";
import { useState } from "react";
import { workerSignUp } from "../actions";
import { Zap } from "lucide-react";

export default function WorkerSignup() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true); setError("");
    const result = await workerSignUp(new FormData(e.currentTarget));
    if (result?.error) { setError(result.error); setLoading(false); }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "11px 14px", borderRadius: 10,
    border: "1px solid #d1d5db", fontSize: 14, color: "#111827",
    outline: "none", boxSizing: "border-box",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 440 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center", marginBottom: 32 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#7c3aed,#4f46e5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Zap size={17} color="#fff" fill="#fff" />
          </div>
          <span style={{ fontSize: 20, fontWeight: 800, color: "#111827" }}>Gig<span style={{ color: "#7c3aed" }}>Shift</span></span>
        </div>

        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 20, padding: "40px 36px", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111827", marginBottom: 6 }}>Create Worker Account</h1>
          <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 28 }}>Start finding shifts and getting paid today</p>

          {error && (
            <div style={{ padding: "10px 14px", borderRadius: 8, background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", fontSize: 13, marginBottom: 20 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Full Name</label>
              <input name="full_name" type="text" required placeholder="Jane Smith" style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Email</label>
              <input name="email" type="email" required placeholder="you@email.com" style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Password</label>
              <input name="password" type="password" required placeholder="Min. 8 characters" minLength={8} style={inputStyle} />
            </div>
            <button type="submit" disabled={loading} style={{
              marginTop: 8, padding: "13px", borderRadius: 10, fontWeight: 700, fontSize: 14,
              color: "#fff", background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
              border: "none", cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1, boxShadow: "0 4px 16px rgba(124,58,237,0.3)",
            }}>
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p style={{ textAlign: "center", fontSize: 13, color: "#6b7280", marginTop: 24 }}>
            Already have an account?{" "}
            <a href="/worker/login" style={{ color: "#7c3aed", fontWeight: 600, textDecoration: "none" }}>Sign in</a>
          </p>
        </div>
      </div>
    </div>
  );
}
