import { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "OTP",
  description: "OTP",
};

export default async function OTPPage() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user || error) {
    redirect("/login");
  }
  if (!user?.user_metadata?.open_otp) {
    redirect("/dashboard");
  }

  return <div>OTPPage</div>;
}
