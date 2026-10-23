import { Resend } from "resend";

// Sends via Resend when RESEND_API_KEY is set; otherwise logs to the server
// console (dev/mock). To go live: create a Resend account, verify a sending
// domain, set RESEND_API_KEY and EMAIL_FROM — no code change needed.
const apiKey = process.env.RESEND_API_KEY;
const from = process.env.EMAIL_FROM || "Roam <onboarding@resend.dev>";
const resend = apiKey ? new Resend(apiKey) : null;

type EmailMessage = {
  to: string;
  subject: string;
  text: string;
};

async function sendEmail({ to, subject, text }: EmailMessage) {
  if (!resend) {
    console.log(
      `\n[email:mock] To: ${to}\n[email:mock] Subject: ${subject}\n[email:mock] ${text}\n`,
    );
    return;
  }
  const { error } = await resend.emails.send({ from, to, subject, text });
  if (error) {
    // Don't surface delivery failures to the caller (e.g. to avoid revealing
    // whether an email exists); just record them.
    console.error("[email] Resend send failed:", error);
  }
}

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  await sendEmail({
    to,
    subject: "Reset your Roam password",
    text: `Reset your password using this link (valid for 1 hour):\n${resetUrl}\n\nIf you didn't request this, you can ignore this email.`,
  });
}
