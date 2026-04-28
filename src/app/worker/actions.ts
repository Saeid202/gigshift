"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function workerSignUp(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const full_name = formData.get("full_name") as string;

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { role: "worker", full_name } },
  });

  if (error) return { error: error.message };
  redirect("/");
}

export async function workerSignIn(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };
  redirect("/worker/dashboard");
}

export async function workerSignOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
