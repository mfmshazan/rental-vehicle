// Email sending. Currently a MOCK: it logs the message to the server console
// instead of delivering real email. To go live, install `resend`, set
// RESEND_API_KEY, and replace the body of `sendEmail` with a Resend call:
//
//   import { Resend } from "resend";
//   const resend = new Resend(process.env.RESEND_API_KEY);
//   await resend.emails.send({ from, to, subject, html });
//
// The rest of the app doesn't change.

type EmailMessage = {
  to: string;
  subject: string;
  text: string;
};

async function sendEmail({ to, subject, text }: EmailMessage) {
  // MOCK delivery — prints to the terminal running the server.
  console.log(
    `\n[email:mock] To: ${to}\n[email:mock] Subject: ${subject}\n[email:mock] ${text}\n`,
  );
}

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  await sendEmail({
    to,
    subject: "Reset your Roam password",
    text: `Reset your password using this link (valid for 1 hour):\n${resetUrl}\n\nIf you didn't request this, you can ignore this email.`,
  });
}
