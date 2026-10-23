import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { ResetPasswordForm } from "@/components/reset-password-form";
export const metadata = { title: "Set a new password" };
export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  if (await auth()) redirect("/dashboard");
  const { token } = await searchParams;
  return (
    <div className="container auth-page">
      <div className="auth-visual">
        <Image src="/images/hero.jpg" alt="The open road awaits" fill sizes="50vw" />
        <div className="auth-visual-shade" />
        <div>
          <span className="eyebrow">ALMOST THERE</span>
          <h2>
            A fresh start
            <br />
            for your account.
          </h2>
          <p>
            Choose a new password
            <br />
            and you’re back on the road.
          </p>
        </div>
      </div>
      <section className="auth-panel">
        <div className="eyebrow">NEW PASSWORD</div>
        <h1>Set a new password.</h1>
        {token ? (
          <>
            <p>Choose a strong password you don’t use elsewhere.</p>
            <ResetPasswordForm token={token} />
          </>
        ) : (
          <>
            <p>This reset link is missing its token. Please request a new one.</p>
            <Link
              href="/forgot-password"
              className="button button-green full-width"
            >
              Request a new link
            </Link>
          </>
        )}
      </section>
    </div>
  );
}
