import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import WorkerDashboardClient from "./WorkerDashboardClient";

type Shift = {
  id: string; title: string; location: string; pay_rate: number;
  shift_date: string; start_time: string; end_time: string;
  spots: number; status: string; description?: string;
  employer: { full_name: string; company_name: string } | null;
};

export default async function WorkerDashboard() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/worker/login");

  const { data: profile } = await supabase
    .from("profiles").select("*").eq("id", user.id).single();

  const { data: shifts } = await supabase
    .from("shifts")
    .select("*, employer:profiles!employer_id(full_name, company_name)")
    .eq("status", "open")
    .gte("shift_date", new Date().toISOString().split("T")[0])
    .order("shift_date", { ascending: true });

  const { data: applications } = await supabase
    .from("applications")
    .select("shift_id, status, shifts(*, employer:profiles!employer_id(full_name, company_name))")
    .eq("worker_id", user.id)
    .order("created_at", { ascending: false });

  const appliedShiftIds = new Set((applications ?? []).map((a: { shift_id: string }) => a.shift_id));
  const upcomingShifts = (applications ?? []).map((a: { shifts: unknown }) => a.shifts).filter(Boolean);

  const { data: workExperience } = await supabase
    .from("worker_skills").select("*").eq("worker_id", user.id).single();

  const { data: payrollInfo } = await supabase
    .from("payroll_info").select("*").eq("worker_id", user.id).single();

  const { data: availability } = await supabase
    .from("availability").select("*").eq("worker_id", user.id).single();

  return (
    <WorkerDashboardClient
      profile={profile}
      availableShifts={shifts ?? []}
      initialAppliedIds={[...appliedShiftIds]}
      initialUpcomingShifts={upcomingShifts as Shift[]}
      initialWorkExperience={workExperience ?? null}
      initialPayroll={payrollInfo ?? null}
      initialAvailability={availability ?? null}
    />
  );
}
