import { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import MfaSetting from "@/components/MfaSetting";
import SignoutButton from "@/components/SignoutButton";
import paths from "@/constants/paths";
import BackupSetting from "@/components/Backup/BackupSetting";

export const dynamic = "force-dynamic";

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
    <div className="h-screen py-6">
      <div className="h-full text-black text-2xl font-bold flex flex-col items-center justify-between">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold">Dashboard</h1>
          <p className="text-2xl mb-4">welcome, {user?.email}</p>
          <MfaSetting user={user} />
          {!!user?.user_metadata?.backup_codes?.length && (
            <BackupSetting user={user} />
          )}
        </div>
        <SignoutButton />
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard",
};
