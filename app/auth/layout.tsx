import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (user) {
    redirect("/dashboard");
  }
  if (error) {
    await supabase.auth.signOut();
  }
  return <>{children}</>;
};

export default AuthLayout;
