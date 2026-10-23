import Image from "next/image";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { ForgotPasswordForm } from "@/components/forgot-password-form";
export const metadata = { title: "Reset your password" };
export default async function ForgotPasswordPage() {
  if (await auth()) redirect("/dashboard");
  return (
    <div className="container auth-page">
      <div className="auth-visual">
        <Image src="/images/hero.jpg" alt="The open road awaits" fill sizes="50vw" />
        <div className="auth-visual-shade" />
        <div>
          <span className="eyebrow">IT HAPPENS</span>
          <h2>
            Let’s get you
            <br />
            back in.
          </h2>
          <p>
            Enter your email and we’ll send
            <br />a secure reset link.
          </p>
        </div>
      </div>
      <section className="auth-panel">
        <div className="eyebrow">FORGOT YOUR PASSWORD?</div>
        <h1>Reset your password.</h1>
        <p>
          We’ll email you a link to set a new one. The link is valid for one
          hour.
        </p>
        <ForgotPasswordForm />
      </section>
    </div>
  );
}
