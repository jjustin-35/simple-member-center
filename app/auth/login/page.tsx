import { cookies } from "next/headers";
import LoginForm from "@/components/LoginForm";

export default async function LoginPage() {
  const cookieStore = await cookies();
  const isTrustedDevice = cookieStore.get("is_trusted_device")?.value === "true";
  return <LoginForm isTrustedDevice={isTrustedDevice} />;
}
