const BRAND = "#2563eb";
const GRADIENT = "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)";

const employerSteps = [
  { n: "01", title: "Create an account",  desc: "Sign up as an employer in under 2 minutes." },
  { n: "02", title: "Post a shift",       desc: "Add role, location, time, and pay rate." },
  { n: "03", title: "Get matched",        desc: "We surface verified, available workers instantly." },
  { n: "04", title: "Confirm & done",     desc: "Approve your worker and they show up ready." },
];
const workerSteps = [
  { n: "01", title: "Build your profile", desc: "Add your skills, availability, and work history." },
  { n: "02", title: "Browse shifts",      desc: "See shifts near you that match your skills." },
  { n: "03", title: "Apply in one tap",   desc: "Express interest and get confirmed fast." },
  { n: "04", title: "Work & get paid",    desc: "Complete the shift and get paid directly." },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" style={{ background: "#ffffff", padding: "80px 32px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px", borderRadius: 100, background: "#eff6ff", border: "1px solid #bfdbfe", fontSize: 11, fontWeight: 700, color: BRAND, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>
            How It Works
          </div>
          <h2 style={{ fontSize: "clamp(28px,3.5vw,42px)", fontWeight: 900, color: "#0f172a", letterSpacing: "-1px", lineHeight: 1.2, marginBottom: 14 }}>
            Simple for everyone,{" "}
            <span style={{ background: GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>powerful under the hood</span>
          </h2>
          <p style={{ fontSize: 16, color: "#64748b", maxWidth: 480, margin: "0 auto" }}>
            Two sides, one platform. Here&apos;s how it flows.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          <Column title="For Employers" sub="Fill shifts fast" color={BRAND} bg="#eff6ff" border="#bfdbfe" steps={employerSteps} />
          <Column title="For Workers" sub="Find work your way" color="#7c3aed" bg="#f5f3ff" border="#ddd6fe" steps={workerSteps} />
        </div>
      </div>
    </section>
  );
}

function Column({ title, sub, color, bg, border, steps }: { title: string; sub: string; color: string; bg: string; border: string; steps: typeof employerSteps }) {
  return (
    <div style={{ borderRadius: 20, overflow: "hidden", border: "1px solid #e2e8f0", boxShadow: "0 2px 16px rgba(0,0,0,0.04)" }}>
      <div style={{ padding: "20px 24px", borderBottom: "1px solid #e2e8f0", background: "#fafafa", display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ padding: "4px 12px", borderRadius: 6, fontSize: 11, fontWeight: 700, background: bg, color, border: `1px solid ${border}` }}>{title}</span>
        <span style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>{sub}</span>
      </div>
      <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
        {steps.map(s => (
          <div key={s.n} style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "16px 18px", border: "1px solid #e2e8f0", borderRadius: 12, background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
            <div style={{ flexShrink: 0, width: 34, height: 34, borderRadius: 9, background: bg, border: `1px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color }}>
              {s.n}
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", margin: "0 0 3px" }}>{s.title}</p>
              <p style={{ fontSize: 13, color: "#64748b", margin: 0, lineHeight: 1.5 }}>{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
