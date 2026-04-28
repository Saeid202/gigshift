const stats = [
  { value: "10,000+", label: "Active Workers",    color: "#7c3aed" },
  { value: "98%",     label: "Shift Fill Rate",   color: "#4f46e5" },
  { value: "4 min",   label: "Avg Match Time",    color: "#059669" },
  { value: "500+",    label: "Businesses Served", color: "#7c3aed" },
];

export default function Stats() {
  return (
    <section style={{ background: "#ffffff", padding: "72px 32px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 0,
          borderRadius: 20, overflow: "hidden",
          border: "1px solid #e5e7eb",
          boxShadow: "0 4px 24px rgba(124,58,237,0.08)",
        }}>
          {stats.map((s, i) => (
            <div key={s.label} style={{
              padding: "40px 24px", textAlign: "center",
              background: "#fff",
              borderRight: i < stats.length - 1 ? "1px solid #e5e7eb" : "none",
            }}>
              <p style={{ fontSize: 44, fontWeight: 900, color: s.color, letterSpacing: "-1px", marginBottom: 8 }}>
                {s.value}
              </p>
              <p style={{ fontSize: 14, color: "#6b7280", fontWeight: 500 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
