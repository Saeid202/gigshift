import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

type Application = {
  id: string; status: string; created_at: string;
  worker_id: string;
  worker: { id: string; full_name: string } | null;
  shift: { title: string; shift_date: string; start_time: string; end_time: string; location: string } | null;
};

export default async function EmployerDashboard() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/employer/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: shifts } = await supabase
    .from("shifts")
    .select("*, applications(count)")
    .eq("employer_id", user.id)
    .order("created_at", { ascending: false });

  // Fetch all applications for this employer's shifts with worker info
  const shiftIds = (shifts ?? []).map(s => s.id);
  const { data: applications } = shiftIds.length > 0
    ? await supabase
        .from("applications")
        .select("*, shift:shifts(title, shift_date, start_time, end_time, location)")
        .in("shift_id", shiftIds)
        .order("created_at", { ascending: false })
    : { data: [] };

  // Fetch worker profiles for each application
  const workerIds = [...new Set((applications ?? []).map((a: {worker_id: string}) => a.worker_id))];
  const { data: workers } = workerIds.length > 0
    ? await supabase.from("profiles").select("id, full_name").in("id", workerIds)
    : { data: [] };

  const workerMap = Object.fromEntries((workers ?? []).map((w: {id: string; full_name: string}) => [w.id, w]));

  const applicationsWithWorkers = (applications ?? []).map((a: {worker_id: string; id: string; status: string; created_at: string; shift: Application["shift"]}) => ({
    ...a,
    worker: workerMap[a.worker_id] ?? null,
  }));

  return <DashboardClient profile={profile} shifts={shifts ?? []} applications={applicationsWithWorkers} />;
}
