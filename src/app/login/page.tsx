import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AuthShell } from "@/components/auth-shell";
export const metadata = { title: "Log in" };
export default async function LoginPage() {
  if (await auth()) redirect("/dashboard");
  return <AuthShell />;
}
