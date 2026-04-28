"use client";
import { useState, useEffect } from "react";
import { Zap, Plus, LogOut, Briefcase, Users, Clock, CheckCircle, X, Eye, Pencil, Trash2, Building2, Phone, Mail, User, ChevronDown } from "lucide-react";
import { signOut } from "../actions";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type Profile = { id?: string; full_name: string; company_name: string; role: string; contact_person?: string; phone?: string; email?: string; company_type?: string } | null;
type Shift = {
  id: string; title: string; description?: string; location: string; pay_rate: number;
  shift_date: string; start_time: string; end_time: string;
  spots: number; status: string; applications: { count: number }[];
};
type Application = {
  id: string; status: string; created_at: string;
  worker: { full_name: string } | null;
  shift: { title: string; shift_date: string; start_time: string; end_time: string; location: string } | null;
};

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "11px 14px", borderRadius: 10,
  border: "1px solid #d1d5db", fontSize: 14, color: "#111827",
  outline: "none", boxSizing: "border-box",
};

const statusColor: Record<string, { bg: string; color: string }> = {
  open:      { bg: "#f0fdf4", color: "#16a34a" },
  filled:    { bg: "#eef2ff", color: "#4f46e5" },
  cancelled: { bg: "#fef2f2", color: "#dc2626" },
};

export default function DashboardClient({ profile, shifts: initialShifts, applications }: { profile: Profile; shifts: Shift[]; applications: Application[] }) {
  const [activeTab, setActiveTab] = useState<"company" | "shifts" | "applicants">("company");
  const [shifts, setShifts] = useState(initialShifts);
  const [appStatuses, setAppStatuses] = useState<Record<string, string>>(
    Object.fromEntries(applications.map(a => [a.id, a.status]))
  );
  const [showPostModal, setShowPostModal] = useState(false);
  const [editShift, setEditShift] = useState<Shift | null>(null);
  const [viewShift, setViewShift] = useState<Shift | null>(null);
  const [deleteShift, setDeleteShift] = useState<Shift | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const stats = [
    { label: "Total Shifts",    value: shifts.length, icon: Briefcase, color: "#7c3aed", bg: "#f5f3ff" },
    { label: "Open Shifts",     value: shifts.filter(s => s.status === "open").length, icon: Clock, color: "#4f46e5", bg: "#eef2ff" },
    { label: "Filled Shifts",   value: shifts.filter(s => s.status === "filled").length, icon: CheckCircle, color: "#059669", bg: "#f0fdf4" },
    { label: "Total Applicants",value: shifts.reduce((acc, s) => acc + (s.applications?.[0]?.count ?? 0), 0), icon: Users, color: "#0891b2", bg: "#ecfeff" },
  ];

  async function handlePostShift(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true); setError("");
    const fd = new FormData(e.currentTarget);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error: err } = await supabase.from("shifts").insert({
      employer_id: user.id,
      title: fd.get("title"), description: fd.get("description"),
      location: fd.get("location"),
      pay_rate: parseFloat(fd.get("pay_rate") as string),
      shift_date: fd.get("shift_date"),
      start_time: fd.get("start_time"), end_time: fd.get("end_time"),
      spots: parseInt(fd.get("spots") as string),
    }).select("*, applications(count)").single();

    if (err) { setError(err.message); setLoading(false); return; }
    setShifts([data, ...shifts]);
    setShowPostModal(false); setLoading(false);
    router.refresh();
  }

  async function handleEditShift(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editShift) return;
    setLoading(true); setError("");
    const fd = new FormData(e.currentTarget);

    const updates = {
      title: fd.get("title"), description: fd.get("description"),
      location: fd.get("location"),
      pay_rate: parseFloat(fd.get("pay_rate") as string),
      shift_date: fd.get("shift_date"),
      start_time: fd.get("start_time"), end_time: fd.get("end_time"),
      spots: parseInt(fd.get("spots") as string),
      status: fd.get("status"),
    };

    const { error: err } = await supabase.from("shifts").update(updates).eq("id", editShift.id);
    if (err) { setError(err.message); setLoading(false); return; }

    setShifts(shifts.map(s => s.id === editShift.id ? { ...s, ...updates } as Shift : s));
    setEditShift(null); setLoading(false);
    router.refresh();
  }

  async function handleDelete() {
    if (!deleteShift) return;
    setLoading(true);
    const { error: err } = await supabase.from("shifts").delete().eq("id", deleteShift.id);
    if (err) { setLoading(false); return; }
    setShifts(shifts.filter(s => s.id !== deleteShift.id));
    setDeleteShift(null); setLoading(false);
    router.refresh();
  }

  async function handleApplicationStatus(appId: string, status: "accepted" | "rejected") {
    const { error: err } = await supabase.from("applications").update({ status }).eq("id", appId);
    if (!err) setAppStatuses(prev => ({ ...prev, [appId]: status }));
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb" }}>
      {/* Sidebar */}
      <div style={{ position: "fixed", top: 0, left: 0, bottom: 0, width: 240, background: "#fff", borderRight: "1px solid #e5e7eb", display: "flex", flexDirection: "column", zIndex: 50 }}>
        <div style={{ padding: "24px 20px", borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,#7c3aed,#4f46e5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Zap size={15} color="#fff" fill="#fff" />
          </div>
          <span style={{ fontSize: 17, fontWeight: 800, color: "#111827" }}>Gig<span style={{ color: "#7c3aed" }}>Shift</span></span>
        </div>
        <nav style={{ padding: "16px 12px", flex: 1 }}>
          {[{ icon: Building2, label: "Company Profile", key: "company" }, { icon: Briefcase, label: "Shifts", key: "shifts" }, { icon: Users, label: "Applicants", key: "applicants" }].map(item => (
            <div key={item.label} onClick={() => setActiveTab(item.key as "company" | "shifts" | "applicants")} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, marginBottom: 4, background: activeTab === item.key ? "#f5f3ff" : "transparent", color: activeTab === item.key ? "#7c3aed" : "#6b7280", fontWeight: activeTab === item.key ? 600 : 500, fontSize: 14, cursor: "pointer" }}>
              <item.icon size={17} />{item.label}
            </div>
          ))}
        </nav>
        <EmployerSidebarProfile profile={profile} />
      </div>

      {/* Main content */}
      <div style={{ marginLeft: 240, padding: "32px 36px" }}>

      {/* Company Profile tab */}
      {activeTab === "company" && (
        <CompanyProfileTab profile={profile} supabase={createClient()} />
      )}

      {/* Shifts tab */}
      {activeTab === "shifts" && (
        <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111827", marginBottom: 4 }}>Welcome back, {profile?.full_name?.split(" ")[0] || "there"} 👋</h1>
            <p style={{ fontSize: 14, color: "#6b7280" }}>Manage your shifts and applicants</p>
          </div>
          <button onClick={() => { setShowPostModal(true); setError(""); }} style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 20px", borderRadius: 10, fontWeight: 700, fontSize: 14, color: "#fff", background: "linear-gradient(135deg,#7c3aed,#4f46e5)", border: "none", cursor: "pointer", boxShadow: "0 4px 16px rgba(124,58,237,0.3)" }}>
            <Plus size={16} /> Post a Shift
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 32 }}>
          {stats.map(s => (
            <div key={s.label} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: "20px", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <p style={{ fontSize: 13, color: "#6b7280", fontWeight: 500 }}>{s.label}</p>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <s.icon size={17} color={s.color} />
                </div>
              </div>
              <p style={{ fontSize: 28, fontWeight: 900, color: "#111827" }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Shifts table */}
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>Your Shifts</h2>
            <span style={{ fontSize: 13, color: "#9ca3af" }}>{shifts.length} total</span>
          </div>
          {shifts.length === 0 ? (
            <div style={{ padding: "60px 24px", textAlign: "center" }}>
              <Briefcase size={40} color="#d1d5db" style={{ margin: "0 auto 16px" }} />
              <p style={{ fontSize: 15, fontWeight: 600, color: "#374151", marginBottom: 6 }}>No shifts yet</p>
              <p style={{ fontSize: 14, color: "#9ca3af" }}>Post your first shift to start finding workers</p>
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f9fafb" }}>
                  {["Role", "Location", "Date", "Pay Rate", "Spots", "Applicants", "Status", "Actions"].map(h => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #e5e7eb" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {shifts.map((s, i) => (
                  <tr key={s.id} style={{ borderBottom: i < shifts.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                    <td style={{ padding: "14px 16px", fontSize: 14, fontWeight: 600, color: "#111827" }}>{s.title}</td>
                    <td style={{ padding: "14px 16px", fontSize: 14, color: "#6b7280" }}>{s.location}</td>
                    <td style={{ padding: "14px 16px", fontSize: 14, color: "#6b7280" }}>{new Date(s.shift_date).toLocaleDateString()}</td>
                    <td style={{ padding: "14px 16px", fontSize: 14, fontWeight: 600, color: "#7c3aed" }}>${s.pay_rate}/hr</td>
                    <td style={{ padding: "14px 16px", fontSize: 14, color: "#6b7280" }}>{s.spots}</td>
                    <td style={{ padding: "14px 16px", fontSize: 14, color: "#6b7280" }}>{s.applications?.[0]?.count ?? 0}</td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{ padding: "4px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600, background: statusColor[s.status]?.bg, color: statusColor[s.status]?.color }}>
                        {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button onClick={() => setViewShift(s)} title="View" style={{ padding: "6px", borderRadius: 7, border: "1px solid #e5e7eb", background: "#f9fafb", cursor: "pointer", display: "flex", alignItems: "center" }}>
                          <Eye size={14} color="#6b7280" />
                        </button>
                        <button onClick={() => { setEditShift(s); setError(""); }} title="Edit" style={{ padding: "6px", borderRadius: 7, border: "1px solid #e5e7eb", background: "#f9fafb", cursor: "pointer", display: "flex", alignItems: "center" }}>
                          <Pencil size={14} color="#4f46e5" />
                        </button>
                        <button onClick={() => setDeleteShift(s)} title="Delete" style={{ padding: "6px", borderRadius: 7, border: "1px solid #fee2e2", background: "#fef2f2", cursor: "pointer", display: "flex", alignItems: "center" }}>
                          <Trash2 size={14} color="#dc2626" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        </div>
      )}

      {/* Applicants tab */}
      {activeTab === "applicants" && (
        <div>
          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111827", marginBottom: 4 }}>Applicants</h1>
            <p style={{ fontSize: 14, color: "#6b7280" }}>Workers who applied to your shifts</p>
          </div>
          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
            {applications.length === 0 ? (
              <div style={{ padding: "60px 24px", textAlign: "center" }}>
                <Users size={40} color="#d1d5db" style={{ margin: "0 auto 16px" }} />
                <p style={{ fontSize: 15, fontWeight: 600, color: "#374151", marginBottom: 6 }}>No applicants yet</p>
                <p style={{ fontSize: 14, color: "#9ca3af" }}>Workers who apply to your shifts will appear here</p>
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f9fafb" }}>
                    {["Worker", "Shift", "Date", "Time", "Location", "Applied", "Status", "Action"].map(h => (
                      <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #e5e7eb" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {applications.map((a, i) => (
                    <tr key={a.id} style={{ borderBottom: i < applications.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#7c3aed,#4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "#fff", flexShrink: 0 }}>
                            {a.worker?.full_name?.charAt(0).toUpperCase() ?? "?"}
                          </div>
                          <span style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{a.worker?.full_name ?? "Unknown"}</span>
                        </div>
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: 14, fontWeight: 600, color: "#111827" }}>{a.shift?.title ?? "—"}</td>
                      <td style={{ padding: "14px 16px", fontSize: 14, color: "#6b7280" }}>{a.shift?.shift_date ? new Date(a.shift.shift_date).toLocaleDateString() : "—"}</td>
                      <td style={{ padding: "14px 16px", fontSize: 14, color: "#6b7280" }}>{a.shift ? `${a.shift.start_time} – ${a.shift.end_time}` : "—"}</td>
                      <td style={{ padding: "14px 16px", fontSize: 14, color: "#6b7280" }}>{a.shift?.location ?? "—"}</td>
                      <td style={{ padding: "14px 16px", fontSize: 13, color: "#9ca3af" }}>{new Date(a.created_at).toLocaleDateString()}</td>
                      <td style={{ padding: "14px 16px" }}>
                        {(() => {
                          const st = appStatuses[a.id] ?? a.status;
                          return (
                            <span style={{
                              padding: "4px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600,
                              background: st === "accepted" ? "#f0fdf4" : st === "rejected" ? "#fef2f2" : "#fefce8",
                              color: st === "accepted" ? "#16a34a" : st === "rejected" ? "#dc2626" : "#ca8a04",
                            }}>
                              {st.charAt(0).toUpperCase() + st.slice(1)}
                            </span>
                          );
                        })()}
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        {(appStatuses[a.id] ?? a.status) === "pending" ? (
                          <div style={{ display: "flex", gap: 6 }}>
                            <button onClick={() => handleApplicationStatus(a.id, "accepted")} style={{ padding: "6px 12px", borderRadius: 7, border: "none", background: "#f0fdf4", color: "#16a34a", fontWeight: 600, fontSize: 12, cursor: "pointer" }}>
                              Accept
                            </button>
                            <button onClick={() => handleApplicationStatus(a.id, "rejected")} style={{ padding: "6px 12px", borderRadius: 7, border: "none", background: "#fef2f2", color: "#dc2626", fontWeight: 600, fontSize: 12, cursor: "pointer" }}>
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: 12, color: "#9ca3af" }}>—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      </div>{/* end main content */}

      {/* ── Post Shift Modal ── */}
      {showPostModal && (
        <Modal title="Post a New Shift" onClose={() => setShowPostModal(false)}>
          {error && <ErrorBox msg={error} />}
          <ShiftForm onSubmit={handlePostShift} loading={loading} submitLabel="Post Shift" />
        </Modal>
      )}

      {/* ── View Shift Modal ── */}
      {viewShift && (
        <Modal title={viewShift.title} onClose={() => setViewShift(null)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              ["Location", viewShift.location],
              ["Date", new Date(viewShift.shift_date).toLocaleDateString()],
              ["Time", `${viewShift.start_time} – ${viewShift.end_time}`],
              ["Pay Rate", `$${viewShift.pay_rate}/hr`],
              ["Spots", String(viewShift.spots)],
              ["Status", viewShift.status.charAt(0).toUpperCase() + viewShift.status.slice(1)],
              ...(viewShift.description ? [["Description", viewShift.description]] : []),
            ].map(([label, value]) => (
              <div key={label} style={{ display: "flex", gap: 12 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#6b7280", minWidth: 90 }}>{label}</span>
                <span style={{ fontSize: 14, color: "#111827" }}>{value}</span>
              </div>
            ))}
          </div>
        </Modal>
      )}

      {/* ── Edit Shift Modal ── */}
      {editShift && (
        <Modal title="Edit Shift" onClose={() => setEditShift(null)}>
          {error && <ErrorBox msg={error} />}
          <ShiftForm onSubmit={handleEditShift} loading={loading} submitLabel="Save Changes" defaultValues={editShift} />
        </Modal>
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteShift && (
        <Modal title="Delete Shift" onClose={() => setDeleteShift(null)}>
          <p style={{ fontSize: 14, color: "#374151", marginBottom: 24 }}>
            Are you sure you want to delete <strong>{deleteShift.title}</strong>? This cannot be undone.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button onClick={() => setDeleteShift(null)} style={{ padding: "10px 18px", borderRadius: 10, border: "1px solid #e5e7eb", background: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", color: "#374151" }}>
              Cancel
            </button>
            <button onClick={handleDelete} disabled={loading} style={{ padding: "10px 18px", borderRadius: 10, border: "none", background: "#dc2626", fontSize: 14, fontWeight: 600, cursor: "pointer", color: "#fff", opacity: loading ? 0.7 : 1 }}>
              {loading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ── Shared sub-components ── */

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 20, padding: "36px", width: "100%", maxWidth: 520, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#111827" }}>{title}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}><X size={20} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function ErrorBox({ msg }: { msg: string }) {
  return (
    <div style={{ padding: "10px 14px", borderRadius: 8, background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", fontSize: 13, marginBottom: 16 }}>
      {msg}
    </div>
  );
}

function ShiftForm({ onSubmit, loading, submitLabel, defaultValues }: {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  loading: boolean;
  submitLabel: string;
  defaultValues?: Partial<Shift>;
}) {
  const today = new Date();
  const [selYear, setSelYear] = useState(defaultValues?.shift_date ? parseInt(defaultValues.shift_date.split("-")[0]) : today.getFullYear());
  const [selMonth, setSelMonth] = useState(defaultValues?.shift_date ? parseInt(defaultValues.shift_date.split("-")[1]) - 1 : today.getMonth());
  const [selDay, setSelDay] = useState(defaultValues?.shift_date ? parseInt(defaultValues.shift_date.split("-")[2]) : today.getDate());

  const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const daysInMonth = new Date(selYear, selMonth + 1, 0).getDate();
  const firstDay = new Date(selYear, selMonth, 1).getDay();
  const shiftDateValue = `${selYear}-${String(selMonth + 1).padStart(2,"0")}-${String(selDay).padStart(2,"0")}`;

  const parseTime = (t?: string) => {
    if (!t) return { h: "9", m: "00", ampm: "AM" };
    const [hStr, mStr] = t.split(":");
    const h24 = parseInt(hStr);
    const ampm = h24 >= 12 ? "PM" : "AM";
    const h = h24 % 12 || 12;
    return { h: String(h), m: mStr?.slice(0, 2) ?? "00", ampm };
  };
  const [startTime, setStartTime] = useState(parseTime(defaultValues?.start_time));
  const [endTime, setEndTime] = useState(parseTime(defaultValues?.end_time));

  function to24(h: string, m: string, ampm: string) {
    let hour = parseInt(h);
    if (ampm === "PM" && hour !== 12) hour += 12;
    if (ampm === "AM" && hour === 12) hour = 0;
    return `${String(hour).padStart(2, "0")}:${m}:00`;
  }

  const hours = Array.from({ length: 12 }, (_, i) => String(i + 1));
  const minutes = ["00", "15", "30", "45"];

  const TimePicker = ({ label, value, onChange }: { label: string; value: { h: string; m: string; ampm: string }; onChange: (v: { h: string; m: string; ampm: string }) => void }) => (
    <div>
      <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 8 }}>{label}</label>
      <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 12, padding: "4px", display: "flex", gap: 4, alignItems: "center" }}>
        {/* Hour */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
          <button type="button" onClick={() => { const i = hours.indexOf(value.h); onChange({ ...value, h: hours[(i + 1) % 12] }); }}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#7c3aed", padding: "2px 0", lineHeight: 1 }}>▲</button>
          <div style={{ textAlign: "center", fontSize: 22, fontWeight: 800, color: "#111827", lineHeight: 1.2 }}>{value.h.padStart(2, "0")}</div>
          <button type="button" onClick={() => { const i = hours.indexOf(value.h); onChange({ ...value, h: hours[(i + 11) % 12] }); }}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#7c3aed", padding: "2px 0", lineHeight: 1 }}>▼</button>
        </div>
        <span style={{ fontSize: 22, fontWeight: 800, color: "#d1d5db" }}>:</span>
        {/* Minute */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
          <button type="button" onClick={() => { const i = minutes.indexOf(value.m); onChange({ ...value, m: minutes[(i + 1) % 4] }); }}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#7c3aed", padding: "2px 0", lineHeight: 1 }}>▲</button>
          <div style={{ textAlign: "center", fontSize: 22, fontWeight: 800, color: "#111827", lineHeight: 1.2 }}>{value.m}</div>
          <button type="button" onClick={() => { const i = minutes.indexOf(value.m); onChange({ ...value, m: minutes[(i + 3) % 4] }); }}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#7c3aed", padding: "2px 0", lineHeight: 1 }}>▼</button>
        </div>
        {/* AM/PM */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4, padding: "4px" }}>
          {["AM", "PM"].map(p => (
            <button key={p} type="button" onClick={() => onChange({ ...value, ampm: p })} style={{
              padding: "6px 10px", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", border: "none",
              background: value.ampm === p ? "linear-gradient(135deg,#7c3aed,#4f46e5)" : "#fff",
              color: value.ampm === p ? "#fff" : "#9ca3af",
              boxShadow: value.ampm === p ? "0 2px 8px rgba(124,58,237,0.3)" : "none",
              transition: "all 0.15s",
            }}>{p}</button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <form onSubmit={e => {
      // inject hidden inputs for 24h time before submit
      const form = e.currentTarget;
      (form.querySelector("[data-start]") as HTMLInputElement).value = to24(startTime.h, startTime.m, startTime.ampm);
      (form.querySelector("[data-end]") as HTMLInputElement).value = to24(endTime.h, endTime.m, endTime.ampm);
      onSubmit(e);
    }} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <input type="hidden" name="start_time" data-start defaultValue="" />
      <input type="hidden" name="end_time" data-end defaultValue="" />
      <div>
        <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Job Title</label>
        <input name="title" type="text" required placeholder="e.g. Warehouse Associate" defaultValue={defaultValues?.title} style={inputStyle} />
      </div>
      <div>
        <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Location</label>
        <input name="location" type="text" required placeholder="e.g. Toronto, ON" defaultValue={defaultValues?.location} style={inputStyle} />
      </div>
      <div>
        <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Description</label>
        <textarea name="description" placeholder="Describe the role and requirements..." rows={3} defaultValue={defaultValues?.description}
          style={{ ...inputStyle, resize: "vertical" }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Pay Rate ($/hr)</label>
          <input name="pay_rate" type="number" required min="1" step="0.5" placeholder="22.00" defaultValue={defaultValues?.pay_rate} style={inputStyle} />
        </div>
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Spots Available</label>
          <input name="spots" type="number" required min="1" defaultValue={defaultValues?.spots ?? 1} style={inputStyle} />
        </div>
      </div>
      <div>
        <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 8 }}>Shift Date</label>
        <input type="hidden" name="shift_date" value={shiftDateValue} />
        {/* Month/Year nav */}
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 14, overflow: "hidden", background: "#fff" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>
            <button type="button" onClick={() => { if (selMonth === 0) { setSelMonth(11); setSelYear(y => y - 1); } else setSelMonth(m => m - 1); setSelDay(1); }}
              style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 8, width: 28, height: 28, cursor: "pointer", color: "#fff", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>‹</button>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{MONTHS[selMonth]} {selYear}</span>
            <button type="button" onClick={() => { if (selMonth === 11) { setSelMonth(0); setSelYear(y => y + 1); } else setSelMonth(m => m + 1); setSelDay(1); }}
              style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 8, width: 28, height: 28, cursor: "pointer", color: "#fff", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>›</button>
          </div>
          {/* Day headers */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", padding: "8px 8px 0" }}>
            {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => (
              <div key={d} style={{ textAlign: "center", fontSize: 11, fontWeight: 600, color: "#9ca3af", padding: "4px 0" }}>{d}</div>
            ))}
          </div>
          {/* Days grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", padding: "4px 8px 10px", gap: 2 }}>
            {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => {
              const isSelected = d === selDay;
              const isToday = d === today.getDate() && selMonth === today.getMonth() && selYear === today.getFullYear();
              const isPast = new Date(selYear, selMonth, d) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
              return (
                <button key={d} type="button" disabled={isPast} onClick={() => setSelDay(d)} style={{
                  padding: "6px 0", borderRadius: 8, border: "none", cursor: isPast ? "not-allowed" : "pointer", fontSize: 13, fontWeight: isSelected ? 700 : 400,
                  background: isSelected ? "linear-gradient(135deg,#7c3aed,#4f46e5)" : isToday ? "#f5f3ff" : "transparent",
                  color: isSelected ? "#fff" : isPast ? "#d1d5db" : isToday ? "#7c3aed" : "#374151",
                  transition: "all 0.1s",
                }}>{d}</button>
              );
            })}
          </div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <TimePicker label="Start Time" value={startTime} onChange={setStartTime} />
        <TimePicker label="End Time" value={endTime} onChange={setEndTime} />
      </div>
      {defaultValues && (
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Status</label>
          <select name="status" defaultValue={defaultValues.status} style={inputStyle}>
            <option value="open">Open</option>
            <option value="filled">Filled</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      )}
      <button type="submit" disabled={loading} style={{ marginTop: 8, padding: "13px", borderRadius: 10, fontWeight: 700, fontSize: 14, color: "#fff", background: "linear-gradient(135deg,#7c3aed,#4f46e5)", border: "none", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, boxShadow: "0 4px 16px rgba(124,58,237,0.3)" }}>
        {loading ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}

/* ── Company Profile Tab ── */
function CompanyProfileTab({ profile, supabase }: { profile: Profile; supabase: ReturnType<typeof createClient> }) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState(profile);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const router = useRouter();

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    const updates = {
      company_name: fd.get("company_name"),
      contact_person: fd.get("contact_person"),
      phone: fd.get("phone"),
      email: fd.get("email"),
      company_type: fd.get("company_type"),
    };
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase.from("profiles").update(updates).eq("id", user.id);
      if (error) {
        alert("Save failed: " + error.message);
        setSaving(false);
        return;
      }
      setData(d => d ? { ...d, ...updates as object } as Profile : d);
      router.refresh();
    }
    setSaving(false);
    setEditing(false);
  }

  const COMPANY_TYPES = ["Contractor", "Renovation", "Logistics", "Warehouse", "Retail", "Hospitality", "Healthcare", "Manufacturing", "Other"];

  return (
    <div style={{ maxWidth: 800 }}>
      {/* Animated header */}
      <div style={{ background: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 50%, #4338ca 100%)", borderRadius: 20, padding: "32px 36px", marginBottom: 32, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
        <div style={{ position: "absolute", bottom: -30, left: -30, width: 140, height: 140, borderRadius: "50%", background: "rgba(249,115,22,0.15)" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Building2 size={22} color="#fff" />
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: 2 }}>Company Profile</p>
              <h1 style={{ fontSize: 24, fontWeight: 900, color: "#fff", letterSpacing: "-0.5px" }}>{data?.company_name || "Your Company"}</h1>
            </div>
          </div>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", marginBottom: 20 }}>
            {data?.company_type || "Complete your profile"} • {data?.contact_person || "Add contact info"}
          </p>
          {!editing && (
            <button onClick={() => setEditing(true)} style={{ padding: "10px 20px", borderRadius: 10, fontWeight: 700, fontSize: 13, color: "#7c3aed", background: "#fff", border: "none", cursor: "pointer", boxShadow: "0 4px 16px rgba(0,0,0,0.15)" }}>
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {editing ? (
        <form onSubmit={handleSave} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 20, padding: "32px", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <AnimatedField label="Company Name" icon={Building2} name="company_name" defaultValue={data?.company_name ?? ""} required focused={focusedField === "company_name"} onFocus={() => setFocusedField("company_name")} onBlur={() => setFocusedField(null)} />
            <AnimatedField label="Contact Person" icon={User} name="contact_person" defaultValue={data?.contact_person ?? ""} focused={focusedField === "contact_person"} onFocus={() => setFocusedField("contact_person")} onBlur={() => setFocusedField(null)} />
            <AnimatedField label="Phone Number" icon={Phone} name="phone" type="tel" defaultValue={data?.phone ?? ""} placeholder="+1 (416) 000-0000" focused={focusedField === "phone"} onFocus={() => setFocusedField("phone")} onBlur={() => setFocusedField(null)} />
            <AnimatedField label="Email" icon={Mail} name="email" type="email" defaultValue={data?.email ?? ""} focused={focusedField === "email"} onFocus={() => setFocusedField("email")} onBlur={() => setFocusedField(null)} />
            
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 10 }}>Company Type</label>
              <div style={{ position: "relative" }}>
                <select name="company_type" defaultValue={data?.company_type ?? ""} style={{ ...inputStyle, appearance: "none", paddingRight: 36 }}>
                  <option value="">Select type...</option>
                  {COMPANY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <ChevronDown size={16} color="#9ca3af" style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
            <button type="button" onClick={() => setEditing(false)} style={{ flex: 1, padding: "12px", borderRadius: 10, fontWeight: 600, fontSize: 14, color: "#374151", background: "#f9fafb", border: "1px solid #e5e7eb", cursor: "pointer" }}>
              Cancel
            </button>
            <button type="submit" disabled={saving} style={{ flex: 2, padding: "12px", borderRadius: 10, fontWeight: 700, fontSize: 14, color: "#fff", background: "linear-gradient(135deg,#7c3aed,#4f46e5)", border: "none", cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1, boxShadow: "0 4px 16px rgba(124,58,237,0.3)" }}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      ) : (
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 20, padding: "32px", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <InfoRow icon={Building2} label="Company Name" value={data?.company_name || "—"} />
            <InfoRow icon={User} label="Contact Person" value={data?.contact_person || "—"} />
            <InfoRow icon={Phone} label="Phone" value={data?.phone || "—"} />
            <InfoRow icon={Mail} label="Email" value={data?.email || "—"} />
            <InfoRow icon={Briefcase} label="Company Type" value={data?.company_type || "—"} />
          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{ width: 40, height: 40, borderRadius: 10, background: "#f5f3ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon size={18} color="#7c3aed" />
      </div>
      <div>
        <p style={{ fontSize: 11, color: "#9ca3af", fontWeight: 500, marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</p>
        <p style={{ fontSize: 14, color: "#111827", fontWeight: 600 }}>{value}</p>
      </div>
    </div>
  );
}

function AnimatedField({ label, icon: Icon, name, type = "text", defaultValue, placeholder, required, focused, onFocus, onBlur }: {
  label: string; icon: React.ElementType; name: string; type?: string; defaultValue: string; placeholder?: string; required?: boolean; focused: boolean; onFocus: () => void; onBlur: () => void;
}) {
  return (
    <div style={{ position: "relative" }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: focused ? "#7c3aed" : "#374151", display: "block", marginBottom: 8, transition: "color 0.2s" }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", transition: "all 0.2s" }}>
          <Icon size={16} color={focused ? "#7c3aed" : "#9ca3af"} />
        </div>
        <input
          name={name} type={type} defaultValue={defaultValue} placeholder={placeholder} required={required}
          onFocus={onFocus} onBlur={onBlur}
          style={{
            width: "100%", padding: "11px 14px 11px 42px", borderRadius: 10,
            border: `2px solid ${focused ? "#7c3aed" : "#e5e7eb"}`,
            fontSize: 14, color: "#111827", outline: "none", boxSizing: "border-box",
            transition: "all 0.2s", background: focused ? "#faf5ff" : "#fff",
          }}
        />
      </div>
    </div>
  );
}

function EmployerSidebarProfile({ profile }: { profile: Profile }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const supabaseClient = createClient();
  const GRAD = "linear-gradient(135deg,#7c3aed,#4f46e5)";

  async function handleOpen() {
    if (!email) {
      const { data: { user } } = await supabaseClient.auth.getUser();
      setEmail(user?.email ?? null);
    }
    setOpen(true);
  }

  const initials = profile?.full_name?.charAt(0).toUpperCase() ?? "E";

  return (
    <div style={{ padding: "12px", borderTop: "1px solid #e5e7eb", position: "relative" }}>
      {open && (
        <>
          <div style={{ position: "fixed", inset: 0, zIndex: 99 }} onClick={() => setOpen(false)} />
          <div style={{ position: "absolute", bottom: "calc(100% + 8px)", left: 12, right: 12, background: "#fff", borderRadius: 16, boxShadow: "0 8px 32px rgba(0,0,0,0.14)", border: "1px solid #e5e7eb", zIndex: 100, overflow: "hidden" }}>
            <div style={{ padding: "16px 16px 12px", borderBottom: "1px solid #f3f4f6" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{ width: 38, height: 38, borderRadius: "50%", background: GRAD, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: "#fff", flexShrink: 0 }}>
                  {initials}
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#111827", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{profile?.full_name || "Employer"}</p>
                  <p style={{ fontSize: 11, color: "#6b7280", margin: "2px 0 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{email ?? "Loading..."}</p>
                </div>
              </div>
              {profile?.company_name && (
                <div style={{ display: "inline-flex", alignItems: "center", padding: "2px 10px", borderRadius: 6, background: "#f5f3ff", border: "1px solid #ddd6fe" }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "#7c3aed" }}>{profile.company_name}</span>
                </div>
              )}
            </div>
            <form action={signOut}>
              <button type="submit" style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#dc2626", textAlign: "left" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#fef2f2")}
                onMouseLeave={e => (e.currentTarget.style.background = "none")}
              >
                <LogOut size={15} /> Sign Out
              </button>
            </form>
          </div>
        </>
      )}

      <button onClick={handleOpen} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 10, background: open ? "#f5f3ff" : "transparent", border: "none", cursor: "pointer", transition: "background 0.15s", textAlign: "left" }}
        onMouseEnter={e => { if (!open) e.currentTarget.style.background = "#f9fafb"; }}
        onMouseLeave={e => { if (!open) e.currentTarget.style.background = "transparent"; }}
      >
        <div style={{ width: 34, height: 34, borderRadius: "50%", flexShrink: 0, background: GRAD, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: "#fff" }}>
          {initials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: "#111827", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{profile?.full_name || "Employer"}</p>
          <p style={{ fontSize: 11, color: "#9ca3af", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{profile?.company_name || "Employer"}</p>
        </div>
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" style={{ flexShrink: 0 }}>
          <path d={open ? "M9 5L5 1L1 5" : "M1 1L5 5L9 1"} stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
}
