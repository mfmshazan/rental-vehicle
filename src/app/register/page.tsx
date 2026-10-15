import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AuthShell } from "@/components/auth-shell";
export const metadata = { title: "Become an owner" };
export default async function RegisterPage() {
  if (await auth()) redirect("/dashboard");
  return <AuthShell register />;
}
