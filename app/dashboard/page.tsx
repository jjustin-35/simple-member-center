import { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import OtpForm from "@/components/Otp/OtpSetting";
import SignoutButton from "@/components/SignoutButton";
import paths from "@/constants/paths";

export default async function Dashboard() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user || error) {
    redirect(paths.login);
  }

  return (
    <div className="min-h-screen py-6 bg-gray-50">
      <div className="bg-gray-50 text-black text-2xl font-bold flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <p className="text-2xl mb-4">welcome, {user?.email}</p>
        <OtpForm user={user} />
        <SignoutButton />
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard",
};
