import { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  console.log(user);

  if (!user || error) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen py-6 bg-gray-50">
      <div className="bg-gray-50 text-black text-2xl font-bold flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <p className="text-2xl">welcome, {user?.email}</p>
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard",
};
