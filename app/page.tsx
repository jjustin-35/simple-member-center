import { redirect } from "next/navigation";
import paths from "@/constants/paths";

export default async function Home() {
  redirect(paths.login);
}
