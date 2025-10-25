"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import paths from "@/constants/paths";

export async function signout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect(paths.login);
}
