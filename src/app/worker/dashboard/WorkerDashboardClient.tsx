"use client";
import { useState } from "react";
import {
  Zap, Search, Briefcase, User, MapPin, Clock, DollarSign,
  Calendar, ChevronRight, LogOut, CheckCircle, XCircle, Building2,
  History, X,
} from "lucide-react";
import { workerSignOut } from "../actions";
import { createClient } from "@/lib/supabase/client";

type Profile = { id: string; full_name: string; phone?: string; city?: string; province?: string; role: string } | null;
type Shift = {
  id: string; title: string; location: string; pay_rate: number;
  shift_date: string; start_time: string; end_time: string;
  spots: number; status: string; description?: string;
  employer: { full_name: string; company_name: string } | null;
};
type WorkExp = { id?: string; availability_type?: string; description?: string; languages?: string[]; forklift?: boolean; forklift_license?: boolean; forklift_license_url?: string; driving_license?: boolean; license_class?: string; lift_capacity?: string } | null;
type Payroll = { bank_name?: string; account_number?: string; transit_number?: string; institution_number?: string; sin?: string } | null;
type Availability = { days?: string[]; shift_types?: string[]; max_hours_per_week?: number } | null;
type Drawer = null | "editProfile" | "workExp" | "payroll" | "timekeeping";
type Tab = "profile" | "available" | "upcoming" | "history" | "account";

const PRIMARY = "#2563eb"; // brand blue
const PRIMARY_DARK = "#1d4ed8"; // darker blue
const ACCENT = "#7c3aed"; // purple accent
const GRADIENT = "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)";
const LIGHT_BG = "#eff6ff"; // light blue bg
const BORDER = "#bfdbfe"; // blue border
const inp: React.CSSProperties = { width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #d1d5db", fontSize: 14, color: "#0f172a", outline: "none", boxSizing: "border-box" };
const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const SHIFT_TYPES = ["Morning","Afternoon","Evening","Overnight"];

export default function WorkerDashboardClient({
  profile: initialProfile,
  availableShifts,
  initialAppliedIds = [],
  initialUpcomingShifts = [],
  initialWorkExperience = null,
  initialPayroll = null,
  initialAvailability = null,
}: {
  profile: Profile;
  availableShifts: Shift[];
  initialAppliedIds?: string[];
  initialUpcomingShifts?: Shift[];
  initialWorkExperience?: WorkExp;
  initialPayroll?: Payroll;
  initialAvailability?: Availability;
}) {
  const [tab, setTab] = useState<Tab>("profile");
  const [drawer, setDrawer] = useState<Drawer>(null);
  const [search, setSearch] = useState("");
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set(initialAppliedIds));
  const [skippedIds, setSkippedIds] = useState<Set<string>>(new Set());
  const [upcomingShifts, setUpcomingShifts] = useState<Shift[]>(initialUpcomingShifts);
  const [profile, setProfile] = useState(initialProfile);
  const [workExp, setWorkExp] = useState<WorkExp>(initialWorkExperience);
  const [payroll, setPayroll] = useState<Payroll>(initialPayroll);
  const [availability, setAvailability] = useState<Availability>(initialAvailability);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  const filtered = availableShifts.filter(s =>
    (!skippedIds.has(s.id)) && (
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.location.toLowerCase().includes(search.toLowerCase()) ||
      (s.employer?.company_name ?? "").toLowerCase().includes(search.toLowerCase())
    )
  );

  async function handleAccept(shift: Shift) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.from("applications").insert({ shift_id: shift.id, worker_id: user.id });
    if (!error) {
      setAppliedIds(prev => new Set(prev).add(shift.id));
      setUpcomingShifts(prev => [shift, ...prev]);
      setSelectedShift(null);
      setTab("upcoming");
    } else {
      alert("Error: " + error.message);
    }
  }

  function handleSkip(shift: Shift) {
    setSkippedIds(prev => new Set(prev).add(shift.id));
    setSelectedShift(null);
  }

  function formatTime(t: string) {
    const [h, m] = t.split(":");
    const hour = parseInt(h);
    return `${hour % 12 || 12}:${m} ${hour >= 12 ? "PM" : "AM"}`;
  }

  function formatDate(d: string) {
    return new Date(d + "T00:00:00").toLocaleDateString("en-CA", { weekday: "short", month: "short", day: "numeric" });
  }

  // ── Save Edit Profile ──
  async function saveProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setSaving(true);
    const fd = new FormData(e.currentTarget);
    const updates = { full_name: fd.get("full_name"), phone: fd.get("phone"), city: fd.get("city"), province: fd.get("province") };
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("profiles").update(updates).eq("id", user.id);
      setProfile(p => p ? { ...p, ...updates as object } as Profile : p);
    }
    setSaving(false); setDrawer(null);
  }

  // ── Save Work Experience (Skills) ──
  async function saveWorkExp(skills: WorkExp) {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("worker_skills").upsert({ ...skills, worker_id: user.id }, { onConflict: "worker_id" });
      setWorkExp(skills);
    }
    setSaving(false); setDrawer(null);
  }

  // ── Save Payroll ──
  async function savePayroll(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setSaving(true);
    const fd = new FormData(e.currentTarget);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const data = { worker_id: user.id, bank_name: fd.get("bank_name"), account_number: fd.get("account_number"), transit_number: fd.get("transit_number"), institution_number: fd.get("institution_number"), sin: fd.get("sin") };
      await supabase.from("payroll_info").upsert(data, { onConflict: "worker_id" });
      setPayroll(data);
    }
    setSaving(false); setDrawer(null);
  }

  // ── Save Availability ──
  async function saveAvailability(days: string[], shiftTypes: string[], maxHours: number) {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const data = { worker_id: user.id, days, shift_types: shiftTypes, max_hours_per_week: maxHours };
      await supabase.from("availability").upsert(data, { onConflict: "worker_id" });
      setAvailability(data);
    }
    setSaving(false); setDrawer(null);
  }

  const navItems: { key: Tab; icon: React.ElementType; label: string }[] = [
    { key: "profile",   icon: User,      label: "Profile" },
    { key: "available", icon: Search,    label: "Available Jobs" },
    { key: "upcoming",  icon: Briefcase, label: "Upcoming" },
    { key: "history",   icon: History,   label: "History" },
    { key: "account",   icon: User,      label: "Account" },
  ];

  const profileMenuItems = [
    { icon: User,       label: "Edit Profile",       key: "editProfile" as Drawer },
    { icon: Briefcase,  label: "Work Experience",     key: "workExp" as Drawer },
    { icon: DollarSign, label: "Payroll Information", key: "payroll" as Drawer },
    { icon: Building2,  label: "Timekeeping",         key: "timekeeping" as Drawer },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", display: "flex" }}>

      {/* Sidebar */}
      <div style={{ position: "fixed", top: 0, left: 0, bottom: 0, width: 240, background: "#fff", borderRight: "1px solid #e2e8f0", display: "flex", flexDirection: "column", zIndex: 50 }}>
        <div style={{ padding: "24px 20px", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: 10 }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,#2563eb,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Zap size={15} color="#fff" fill="#fff" />
            </div>
            <span style={{ fontSize: 17, fontWeight: 800, color: "#0f172a" }}>Gig<span style={{ color: "#2563eb" }}>Shift</span></span>
          </a>
        </div>
        <nav style={{ padding: "16px 12px", flex: 1 }}>
          {navItems.map(item => (
            <div key={item.key} onClick={() => setTab(item.key)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, marginBottom: 4, background: tab === item.key ? "#eff6ff" : "transparent", color: tab === item.key ? PRIMARY : "#6b7280", fontWeight: tab === item.key ? 600 : 500, fontSize: 14, cursor: "pointer", borderLeft: tab === item.key ? `3px solid ${PRIMARY}` : "3px solid transparent" }}>
              <item.icon size={17} />{item.label}
            </div>
          ))}
        </nav>
        <SidebarProfile profile={profile} />
      </div>

      {/* Main */}
      <div style={{ marginLeft: 240, flex: 1, padding: "32px 36px" }}>

        {/* Profile tab */}
        {tab === "profile" && (
          <div style={{ maxWidth: 600 }}>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", marginBottom: 24 }}>Profile</h1>
            <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "24px", marginBottom: 16, display: "flex", alignItems: "center", gap: 20, boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg,#2563eb,#1d4ed8,#1e40af)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 800, color: "#fff" }}>
                {profile?.full_name?.charAt(0).toUpperCase() ?? "W"}
              </div>
              <div>
                <p style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", marginBottom: 2 }}>{profile?.full_name || "Worker"}</p>
                {profile?.city && <p style={{ fontSize: 13, color: "#64748b" }}>{profile.city}{profile.province ? `, ${profile.province}` : ""}</p>}
                {profile?.phone && <p style={{ fontSize: 13, color: "#64748b" }}>{profile.phone}</p>}
              </div>
            </div>
            <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
              {profileMenuItems.map((item, i, arr) => (
                <div key={item.label} onClick={() => setDrawer(item.key)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", cursor: "pointer", borderBottom: i < arr.length - 1 ? "1px solid #f3f4f6" : "none" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#f9fafb")}
                  onMouseLeave={e => (e.currentTarget.style.background = "#fff")}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <item.icon size={17} color="#6b7280" />
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>{item.label}</span>
                  </div>
                  <ChevronRight size={16} color="#9ca3af" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Available Jobs */}
        {tab === "available" && (
          <div>
            {/* Vibrant welcome banner */}
            <div style={{ background: GRADIENT, borderRadius: 20, padding: "28px 32px", marginBottom: 28, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -30, right: -30, width: 140, height: 140, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
              <div style={{ position: "absolute", bottom: -20, right: 60, width: 80, height: 80, borderRadius: "50%", background: "rgba(124,58,237,0.3)" }} />
              <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
              <p style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.8)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Ready to work? 🚀</p>
              <h1 style={{ fontSize: 26, fontWeight: 900, color: "#fff", marginBottom: 4, letterSpacing: "-0.5px" }}>Available Jobs</h1>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.75)" }}>{availableShifts.length} open shifts near you</p>
            </div>
            <div style={{ position: "relative", maxWidth: 420, marginBottom: 24 }}>
              <Search size={15} color="#9ca3af" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search jobs, location, company..." style={{ width: "100%", padding: "10px 14px 10px 36px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 14, color: "#0f172a", outline: "none", boxSizing: "border-box", background: "#fff" }} />
            </div>
            {filtered.length === 0 ? (
              <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "60px 24px", textAlign: "center" }}>
                <Briefcase size={40} color="#d1d5db" style={{ margin: "0 auto 12px" }} />
                <p style={{ fontWeight: 600, color: "#1e293b", marginBottom: 4 }}>No jobs available</p>
                <p style={{ fontSize: 13, color: "#94a3b8" }}>Check back soon for new shifts</p>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
                {filtered.map(shift => (
                  <ShiftCard key={shift.id} shift={shift} formatDate={formatDate} formatTime={formatTime} onSelect={setSelectedShift} applied={appliedIds.has(shift.id)} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Upcoming */}
        {tab === "upcoming" && (
          upcomingShifts.length === 0 ? (
            <EmptyState title="No upcoming shifts" subtitle="Accept a shift from Available Jobs to see it here" onBrowse={() => setTab("available")} />
          ) : (
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", marginBottom: 24 }}>Upcoming Shifts</h1>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
                {upcomingShifts.map((shift: Shift) => (
                  <div key={shift.id} style={{ background: "#fff", border: "1px solid #ddd6fe", borderRadius: 16, padding: "20px", boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                      <div>
                        <p style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", marginBottom: 3 }}>{shift.title}</p>
                        <p style={{ fontSize: 13, color: PRIMARY, fontWeight: 600 }}>{shift.employer?.company_name || shift.employer?.full_name || "Company"}</p>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                        <span style={{ fontSize: 15, fontWeight: 800, color: PRIMARY }}>${shift.pay_rate}/hr</span>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 6, background: "#f5f3ff", color: "#7c3aed", border: "1px solid #ddd6fe" }}>Applied ✓</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      <Pill icon={MapPin} text={shift.location} />
                      <Pill icon={Calendar} text={formatDate(shift.shift_date)} />
                      <Pill icon={Clock} text={`${formatTime(shift.start_time)} – ${formatTime(shift.end_time)}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        )}

        {tab === "history" && <EmptyState title="No shift history yet" subtitle="Your completed shifts will appear here" />}

        {tab === "account" && (
          <div style={{ maxWidth: 600 }}>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", marginBottom: 24 }}>Account</h1>
            <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "24px", marginBottom: 16, display: "flex", alignItems: "center", gap: 20, boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg,#2563eb,#1d4ed8,#1e40af)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 800, color: "#fff" }}>
                {profile?.full_name?.charAt(0).toUpperCase() ?? "W"}
              </div>
              <div>
                <p style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", marginBottom: 2 }}>{profile?.full_name || "Worker"}</p>
                <span style={{ fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 6, background: "#eff6ff", color: PRIMARY }}>Worker</span>
              </div>
            </div>
            <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
              {profileMenuItems.map((item, i, arr) => (
                <div key={item.label} onClick={() => { setTab("profile"); setDrawer(item.key); }} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", cursor: "pointer", borderBottom: i < arr.length - 1 ? "1px solid #f3f4f6" : "none" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#f9fafb")}
                  onMouseLeave={e => (e.currentTarget.style.background = "#fff")}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <item.icon size={17} color="#6b7280" />
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>{item.label}</span>
                  </div>
                  <ChevronRight size={16} color="#9ca3af" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Shift modal */}
      {selectedShift && (
        <ShiftDetailModal shift={selectedShift} formatDate={formatDate} formatTime={formatTime} applied={appliedIds.has(selectedShift.id)} onAccept={handleAccept} onSkip={handleSkip} onClose={() => setSelectedShift(null)} />
      )}

      {/* ── Drawers ── */}
      {drawer && (
        <div style={{ position: "fixed", inset: 0, zIndex: 300, display: "flex" }}>
          <div style={{ flex: 1, background: "rgba(0,0,0,0.4)" }} onClick={() => setDrawer(null)} />
          <div style={{ width: 480, background: "#fff", height: "100%", overflowY: "auto", boxShadow: "-8px 0 40px rgba(0,0,0,0.15)", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "24px 28px", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a" }}>
                {drawer === "editProfile" ? "Edit Profile" : drawer === "workExp" ? "Work Experience" : drawer === "payroll" ? "Payroll Information" : "Timekeeping"}
              </h2>
              <button onClick={() => setDrawer(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}><X size={20} /></button>
            </div>

            <div style={{ padding: "28px", flex: 1 }}>

              {/* Edit Profile */}
              {drawer === "editProfile" && (
                <form onSubmit={saveProfile} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <Field label="Full Name"><input name="full_name" defaultValue={profile?.full_name ?? ""} required style={inp} /></Field>
                  <Field label="Phone Number"><input name="phone" type="tel" defaultValue={profile?.phone ?? ""} placeholder="+1 (416) 000-0000" style={inp} /></Field>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <Field label="City"><input name="city" defaultValue={profile?.city ?? ""} placeholder="Toronto" style={inp} /></Field>
                    <Field label="Province"><input name="province" defaultValue={profile?.province ?? ""} placeholder="ON" style={inp} /></Field>
                  </div>
                  <SaveBtn saving={saving} />
                </form>
              )}

              {/* Work Experience */}
              {drawer === "workExp" && (
                <WorkSkillsForm initial={workExp} saving={saving} onSave={saveWorkExp} />
              )}

              {/* Payroll */}
              {drawer === "payroll" && (
                <form onSubmit={savePayroll} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{ background: "#fefce8", border: "1px solid #fde68a", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#92400e" }}>
                    Your payroll information is encrypted and stored securely.
                  </div>
                  <Field label="Bank Name"><input name="bank_name" defaultValue={payroll?.bank_name ?? ""} placeholder="e.g. TD Bank" style={inp} /></Field>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <Field label="Transit Number"><input name="transit_number" defaultValue={payroll?.transit_number ?? ""} placeholder="00000" maxLength={5} style={inp} /></Field>
                    <Field label="Institution Number"><input name="institution_number" defaultValue={payroll?.institution_number ?? ""} placeholder="000" maxLength={3} style={inp} /></Field>
                  </div>
                  <Field label="Account Number"><input name="account_number" defaultValue={payroll?.account_number ?? ""} placeholder="000000000" style={inp} /></Field>
                  <Field label="SIN (Social Insurance Number)"><input name="sin" defaultValue={payroll?.sin ?? ""} placeholder="000-000-000" maxLength={11} style={inp} /></Field>
                  <SaveBtn saving={saving} />
                </form>
              )}

              {/* Timekeeping / Availability */}
              {drawer === "timekeeping" && (
                <AvailabilityForm initial={availability} saving={saving} onSave={saveAvailability} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Small helpers ── */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ fontSize: 13, fontWeight: 600, color: "#1e293b", display: "block", marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  );
}

function SaveBtn({ saving }: { saving: boolean }) {
  return (
    <button type="submit" disabled={saving} style={{ marginTop: 8, padding: "12px", borderRadius: 10, fontWeight: 700, fontSize: 14, color: "#fff", background: "linear-gradient(135deg,#2563eb,#7c3aed)", border: "none", cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1, boxShadow: "0 4px 14px rgba(37,99,235,0.3)" }}>
      {saving ? "Saving..." : "Save Changes"}
    </button>
  );
}

function AvailabilityForm({ initial, saving, onSave }: { initial: Availability; saving: boolean; onSave: (days: string[], types: string[], hours: number) => void }) {
  const [days, setDays] = useState<string[]>(initial?.days ?? []);
  const [types, setTypes] = useState<string[]>(initial?.shift_types ?? []);
  const [hours, setHours] = useState(initial?.max_hours_per_week ?? 40);

  function toggle(arr: string[], val: string, set: (v: string[]) => void) {
    set(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#1e293b", marginBottom: 12 }}>Available Days</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {DAYS.map(d => (
            <button key={d} type="button" onClick={() => toggle(days, d, setDays)} style={{ padding: "7px 14px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", border: `1.5px solid ${days.includes(d) ? PRIMARY : "#e5e7eb"}`, background: days.includes(d) ? "#eff6ff" : "#fff", color: days.includes(d) ? PRIMARY : "#6b7280" }}>
              {d.slice(0, 3)}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#1e293b", marginBottom: 12 }}>Preferred Shift Times</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {SHIFT_TYPES.map(t => (
            <button key={t} type="button" onClick={() => toggle(types, t, setTypes)} style={{ padding: "7px 14px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", border: `1.5px solid ${types.includes(t) ? PRIMARY : "#e5e7eb"}`, background: types.includes(t) ? "#eff6ff" : "#fff", color: types.includes(t) ? PRIMARY : "#6b7280" }}>
              {t}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#1e293b", marginBottom: 8 }}>Max Hours Per Week: <span style={{ color: PRIMARY }}>{hours}</span></p>
        <input type="range" min={1} max={80} value={hours} onChange={e => setHours(Number(e.target.value))} style={{ width: "100%", accentcolor: PRIMARY }} />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#94a3b8", marginTop: 4 }}>
          <span>1 hr</span><span>80 hrs</span>
        </div>
      </div>
      <button type="button" onClick={() => onSave(days, types, hours)} disabled={saving} style={{ padding: "12px", borderRadius: 10, fontWeight: 700, fontSize: 14, color: "#fff", background: "linear-gradient(135deg,#2563eb,#1d4ed8,#1e40af)", border: "none", cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1, boxShadow: "0 4px 14px rgba(37,99,235,0.3)" }}>
        {saving ? "Saving..." : "Save Availability"}
      </button>
    </div>
  );
}

function Pill({ icon: Icon, text }: { icon: React.ElementType; text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5, background: "#eff6ff", borderRadius: 8, padding: "4px 10px", border: "1px solid #bfdbfe" }}>
      <Icon size={12} color={PRIMARY} />
      <span style={{ fontSize: 12, color: "#1e40af", fontWeight: 500 }}>{text}</span>
    </div>
  );
}

function EmptyState({ title, subtitle, onBrowse }: { title: string; subtitle: string; onBrowse?: () => void }) {
  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", marginBottom: 24 }}>{title}</h1>
      <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "60px 24px", textAlign: "center", boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
        <Briefcase size={40} color="#d1d5db" style={{ margin: "0 auto 12px" }} />
        <p style={{ fontWeight: 700, color: "#1e293b", marginBottom: 6 }}>{title}</p>
        <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: onBrowse ? 20 : 0 }}>{subtitle}</p>
        {onBrowse && (
          <button onClick={onBrowse} style={{ padding: "10px 22px", borderRadius: 10, fontWeight: 700, fontSize: 13, color: "#fff", background: "linear-gradient(135deg,#2563eb,#1d4ed8,#1e40af)", border: "none", cursor: "pointer" }}>
            Browse Jobs
          </button>
        )}
      </div>
    </div>
  );
}

function WorkSkillsForm({ initial, saving, onSave }: { initial: WorkExp; saving: boolean; onSave: (s: WorkExp) => void }) {
  const [avail, setAvail] = useState(initial?.availability_type ?? "");
  const [desc, setDesc] = useState<string[]>(
    initial?.description ? initial.description.split(",").map(s => s.trim()) : []
  );
  const [langs, setLangs] = useState<string[]>(initial?.languages ?? []);
  const [forklift, setForklift] = useState(initial?.forklift ?? false);
  const [forkliftLicense, setForkliftLicense] = useState(initial?.forklift_license ?? false);
  const [forkliftLicenseUrl, setForkliftLicenseUrl] = useState(initial?.forklift_license_url ?? "");
  const [uploadingLicense, setUploadingLicense] = useState(false);
  const [driving, setDriving] = useState(initial?.driving_license ?? false);
  const [licClass, setLicClass] = useState(initial?.license_class ?? "");
  const [lift, setLift] = useState(initial?.lift_capacity ?? "");

  function toggleLang(l: string) { setLangs(prev => prev.includes(l) ? prev.filter(x => x !== l) : [...prev, l]); }

  async function handleLicenseUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLicense(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const ext = file.name.split(".").pop();
      const path = `forklift-licenses/${user.id}.${ext}`;
      const { error } = await supabase.storage.from("worker-docs").upload(path, file, { upsert: true });
      if (!error) {
        const { data } = supabase.storage.from("worker-docs").getPublicUrl(path);
        setForkliftLicenseUrl(data.publicUrl);
      }
    }
    setUploadingLicense(false);
  }

  const section = (title: string, children: React.ReactNode) => (
    <div style={{ marginBottom: 28 }}>
      <p style={{ fontSize: 13, fontWeight: 700, color: "#1e293b", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.05em" }}>{title}</p>
      {children}
    </div>
  );

  const pillBtn = (label: string, active: boolean, onClick: () => void, color = PRIMARY) => (
    <button type="button" onClick={onClick} style={{ padding: "9px 18px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", border: `2px solid ${active ? color : "#e5e7eb"}`, background: active ? color : "#fff", color: active ? "#fff" : "#6b7280", transition: "all 0.15s" }}>
      {label}
    </button>
  );

  const toggle = (val: boolean, set: (v: boolean) => void, label: string) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: "1px solid #f3f4f6" }}>
      <span style={{ fontSize: 14, fontWeight: 500, color: "#0f172a" }}>{label}</span>
      <div onClick={() => set(!val)} style={{ width: 48, height: 26, borderRadius: 13, background: val ? "#2563eb" : "#d1d5db", cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
        <div style={{ position: "absolute", top: 3, left: val ? 25 : 3, width: 20, height: 20, borderRadius: "50%", background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.2)", transition: "left 0.2s" }} />
      </div>
    </div>
  );

  return (
    <div>
      {section("What are your availabilities?",
        <div style={{ display: "flex", gap: 10 }}>
          {pillBtn("Part time", avail === "part_time", () => setAvail("part_time"))}
          {pillBtn("Full time", avail === "full_time", () => setAvail("full_time"))}
        </div>
      )}

      {section("Tell us what best describes you",
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {["Student", "Looking for a side job", "In between jobs", "Recently graduated", "Stay-at-home parent returning to work", "Retired & looking for extra income", "New to Canada", "Other"].map(opt => (
            <button key={opt} type="button" onClick={() => setDesc(prev => prev.includes(opt) ? prev.filter(x => x !== opt) : [...prev, opt])}
              style={{ padding: "9px 16px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", border: `2px solid ${desc.includes(opt) ? PRIMARY : "#e5e7eb"}`, background: desc.includes(opt) ? "#eff6ff" : "#fff", color: desc.includes(opt) ? PRIMARY : "#6b7280", transition: "all 0.15s" }}>
              {opt}
            </button>
          ))}
        </div>
      )}

      {section("In which language(s) can you work?",
        <div>
          {toggle(langs.includes("English"), () => toggleLang("English"), "English")}
          {toggle(langs.includes("French"), () => toggleLang("French"), "French")}
          {toggle(langs.includes("Spanish"), () => toggleLang("Spanish"), "Spanish")}
        </div>
      )}

      {section("Physical capabilities",
        <div>
          {toggle(forklift, setForklift, "Do you have forklift experience?")}
          {toggle(forkliftLicense, setForkliftLicense, "Do you have a forklift license?")}
          {forkliftLicense && (
            <div style={{ marginTop: 14, padding: "16px", borderRadius: 12, border: "1.5px dashed #bfdbfe", background: "#faf5ff" }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#1e293b", marginBottom: 10 }}>Upload Forklift License</p>
              {forkliftLicenseUrl ? (
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: "#f5f3ff", border: "1px solid #ddd6fe", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <CheckCircle size={18} color="#7c3aed" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#7c3aed", margin: 0 }}>License uploaded ✓</p>
                    <a href={forkliftLicenseUrl} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: PRIMARY }}>View file</a>
                  </div>
                  <label style={{ fontSize: 12, color: "#64748b", cursor: "pointer", textDecoration: "underline" }}>
                    Replace
                    <input type="file" accept="image/*,.pdf" onChange={handleLicenseUpload} style={{ display: "none" }} />
                  </label>
                </div>
              ) : (
                <label style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, cursor: "pointer", padding: "12px 0" }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {uploadingLicense ? <span style={{ fontSize: 12, color: PRIMARY }}>...</span> : <span style={{ fontSize: 22 }}>📄</span>}
                  </div>
                  <span style={{ fontSize: 13, color: PRIMARY, fontWeight: 600 }}>{uploadingLicense ? "Uploading..." : "Tap to upload"}</span>
                  <span style={{ fontSize: 11, color: "#94a3b8" }}>JPG, PNG or PDF</span>
                  <input type="file" accept="image/*,.pdf" onChange={handleLicenseUpload} style={{ display: "none" }} disabled={uploadingLicense} />
                </label>
              )}
            </div>
          )}
          <div style={{ marginTop: 20 }}>
            <p style={{ fontSize: 14, fontWeight: 500, color: "#0f172a", marginBottom: 12 }}>Up to how much can you lift?</p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {["10 lbs", "25 lbs", "50 lbs", "75 lbs+"].map(l => <span key={l}>{pillBtn(l, lift === l, () => setLift(l))}</span>)}
            </div>
          </div>
        </div>
      )}

      {section("Do you have a driving license?",
        <div>
          {toggle(driving, setDriving, "I have a valid driving license")}
          {driving && (
            <div style={{ marginTop: 16 }}>
              <p style={{ fontSize: 14, fontWeight: 500, color: "#0f172a", marginBottom: 12 }}>License class</p>
              <div style={{ display: "flex", gap: 10 }}>
                {["G1", "G2", "Full G"].map(c => <span key={c}>{pillBtn(c, licClass === c, () => setLicClass(c), "#1d4ed8")}</span>)}
              </div>
            </div>
          )}
        </div>
      )}

      <button type="button" onClick={() => onSave({ availability_type: avail, description: desc.join(", "), languages: langs, forklift, forklift_license: forkliftLicense, forklift_license_url: forkliftLicenseUrl, driving_license: driving, license_class: licClass, lift_capacity: lift })}
        disabled={saving} style={{ width: "100%", marginTop: 8, padding: "13px", borderRadius: 10, fontWeight: 700, fontSize: 14, color: "#fff", background: "linear-gradient(135deg,#2563eb,#1d4ed8,#1e40af)", border: "none", cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1, boxShadow: "0 4px 14px rgba(37,99,235,0.3)" }}>
        {saving ? "Saving..." : "Save"}
      </button>
    </div>
  );
}

function SidebarProfile({ profile }: { profile: Profile }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const supabaseClient = createClient();

  async function handleOpen() {
    if (!email) {
      const { data: { user } } = await supabaseClient.auth.getUser();
      setEmail(user?.email ?? null);
    }
    setOpen(true);
  }

  const initials = profile?.full_name?.charAt(0).toUpperCase() ?? "W";
  const GRAD = "linear-gradient(135deg,#2563eb,#7c3aed)";

  return (
    <div style={{ padding: "12px", borderTop: "1px solid #e2e8f0", position: "relative" }}>
      {/* Popover */}
      {open && (
        <>
          <div style={{ position: "fixed", inset: 0, zIndex: 99 }} onClick={() => setOpen(false)} />
          <div style={{ position: "absolute", bottom: "calc(100% + 8px)", left: 12, right: 12, background: "#fff", borderRadius: 16, boxShadow: "0 8px 32px rgba(0,0,0,0.14)", border: "1px solid #e2e8f0", zIndex: 100, overflow: "hidden" }}>
            {/* User info */}
            <div style={{ padding: "16px 16px 12px", borderBottom: "1px solid #f1f5f9" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{ width: 38, height: 38, borderRadius: "50%", background: GRAD, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: "#fff", flexShrink: 0 }}>
                  {initials}
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{profile?.full_name || "Worker"}</p>
                  <p style={{ fontSize: 11, color: "#64748b", margin: "2px 0 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{email ?? "Loading..."}</p>
                </div>
              </div>
              <div style={{ display: "inline-flex", alignItems: "center", padding: "2px 10px", borderRadius: 6, background: "#eff6ff", border: "1px solid #bfdbfe" }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: "#2563eb" }}>Worker</span>
              </div>
            </div>
            {/* Sign out */}
            <form action={workerSignOut}>
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

      {/* Trigger button */}
      <button onClick={handleOpen} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 10, background: open ? "#eff6ff" : "transparent", border: "none", cursor: "pointer", transition: "background 0.15s", textAlign: "left" }}
        onMouseEnter={e => { if (!open) e.currentTarget.style.background = "#f8fafc"; }}
        onMouseLeave={e => { if (!open) e.currentTarget.style.background = "transparent"; }}
      >
        <div style={{ width: 34, height: 34, borderRadius: "50%", flexShrink: 0, background: GRAD, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: "#fff" }}>
          {initials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{profile?.full_name || "Worker"}</p>
          <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>Worker</p>
        </div>
        <div style={{ width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d={open ? "M9 5L5 1L1 5" : "M1 1L5 5L9 1"} stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
      </button>
    </div>
  );
}

function ShiftCard({ shift, formatDate, formatTime, onSelect, applied }: { shift: Shift; formatDate: (d: string) => string; formatTime: (t: string) => string; onSelect: (s: Shift) => void; applied: boolean }) {
  return (
    <div onClick={() => onSelect(shift)} style={{ background: "#fff", border: `1px solid ${applied ? "#ddd6fe" : "#e2e8f0"}`, borderRadius: 16, padding: "20px", cursor: "pointer", boxShadow: "0 1px 8px rgba(0,0,0,0.06)", transition: "all 0.15s", position: "relative", overflow: "hidden" }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 6px 20px rgba(37,99,235,0.12)"; e.currentTarget.style.borderColor = "#bfdbfe"; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 1px 8px rgba(0,0,0,0.06)"; e.currentTarget.style.borderColor = applied ? "#ddd6fe" : "#e2e8f0"; }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: GRADIENT }} />
      {applied && <span style={{ position: "absolute", top: 14, right: 14, fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 6, background: "#f5f3ff", color: "#7c3aed", border: "1px solid #ddd6fe" }}>Applied ✓</span>}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12, marginTop: 6 }}>
        <div>
          <p style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", marginBottom: 3 }}>{shift.title}</p>
          <p style={{ fontSize: 13, color: PRIMARY, fontWeight: 600 }}>{shift.employer?.company_name || shift.employer?.full_name || "Company"}</p>
        </div>
        <span style={{ fontSize: 16, fontWeight: 900, color: ACCENT, marginRight: applied ? 60 : 0 }}>${shift.pay_rate}/hr</span>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        <Pill icon={MapPin} text={shift.location} />
        <Pill icon={Calendar} text={formatDate(shift.shift_date)} />
        <Pill icon={Clock} text={`${formatTime(shift.start_time)} – ${formatTime(shift.end_time)}`} />
      </div>
    </div>
  );
}

function ShiftDetailModal({ shift, formatDate, formatTime, applied, onAccept, onSkip, onClose }: { shift: Shift; formatDate: (d: string) => string; formatTime: (t: string) => string; applied: boolean; onAccept: (s: Shift) => void; onSkip: (s: Shift) => void; onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  async function handleAccept() { setLoading(true); await onAccept(shift); setLoading(false); }
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 20, padding: "36px", width: "100%", maxWidth: 520, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a" }}>{shift.title}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: 20 }}>✕</button>
        </div>
        <p style={{ fontSize: 14, color: PRIMARY, fontWeight: 600, marginBottom: 24 }}>{shift.employer?.company_name || shift.employer?.full_name || "Company"}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 24 }}>
          {[
            { icon: MapPin, label: "Location", value: shift.location },
            { icon: Calendar, label: "Date", value: formatDate(shift.shift_date) },
            { icon: Clock, label: "Time", value: `${formatTime(shift.start_time)} – ${formatTime(shift.end_time)}` },
            { icon: DollarSign, label: "Pay Rate", value: `$${shift.pay_rate}/hr` },
            { icon: User, label: "Spots", value: `${shift.spots} available` },
          ].map(row => (
            <div key={row.label} style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <row.icon size={16} color={PRIMARY} />
              </div>
              <div>
                <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500, marginBottom: 1 }}>{row.label}</p>
                <p style={{ fontSize: 14, color: "#0f172a", fontWeight: 600 }}>{row.value}</p>
              </div>
            </div>
          ))}
        </div>
        {shift.description && (
          <div style={{ background: "#f8fafc", borderRadius: 12, padding: "14px", marginBottom: 24 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 6 }}>DESCRIPTION</p>
            <p style={{ fontSize: 14, color: "#1e293b", lineHeight: 1.6 }}>{shift.description}</p>
          </div>
        )}
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={() => onSkip(shift)} style={{ flex: 1, padding: "13px", borderRadius: 10, fontWeight: 700, fontSize: 14, color: "#dc2626", background: "#fef2f2", border: "1px solid #fecaca", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <XCircle size={16} /> Skip
          </button>
          <button onClick={handleAccept} disabled={loading || applied} style={{ flex: 2, padding: "13px", borderRadius: 10, fontWeight: 700, fontSize: 14, color: "#fff", background: applied ? "#7c3aed" : GRADIENT, border: "none", cursor: loading || applied ? "default" : "pointer", boxShadow: "0 4px 14px rgba(37,99,235,0.3)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: loading ? 0.7 : 1 }}>
            <CheckCircle size={16} />
            {applied ? "Applied ✓" : loading ? "Applying..." : "Accept Shift"}
          </button>
        </div>
      </div>
    </div>
  );
}
