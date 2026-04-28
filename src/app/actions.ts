"use server";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function signUp(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const full_name = formData.get("full_name") as string;
  const company_name = formData.get("company_name") as string;
  const role = formData.get("role") as string;

  const { error } = await supabase.auth.signUp({
    email, password,
    options: { data: { role, full_name, company_name } },
  });
  if (error) return { error: error.message };
  return { success: true };
}

export async function signIn(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };

  const userRole = data.user?.user_metadata?.role;
  if (userRole === "employer") redirect("/employer/dashboard");
  if (userRole === "worker") redirect("/worker/dashboard");
  return { error: "Unknown role" };
}
