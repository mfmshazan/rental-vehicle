import Link from "next/link";
export const metadata = { title: "Privacy" };
export default function PrivacyPage() {
  return (
    <article className="container prose-page">
      <Link href="/" className="back-link">
        ← Back to Roam
      </Link>
      <div className="eyebrow">YOUR DETAILS, EXPLAINED</div>
      <h1>Privacy at Roam.</h1>
      <p className="lead">
        Here is how this version of Roam handles the information you share.
      </p>
      <h2>Owner accounts and listings</h2>
      <p>
        We store your name, email address, mobile number, and a hashed password
        to provide your owner account. Your name, mobile number, vehicle
        details, and uploaded photo appear publicly on your published listings.
        Your password and account email are not displayed on listings.
      </p>
      <h2>Customer inquiries</h2>
      <p>
        When you send an inquiry, your name, email, phone number, dates, and
        message are stored and shown to that vehicle’s owner. They can use those
        details to reply to your rental inquiry.
      </p>
      <h2>Cookies and saved vehicles</h2>
      <p>
        Essential authentication cookies keep owners signed in. Saved vehicles
        are stored in your browser on this device. You can remove a saved
        vehicle using its heart button, or clear your browser’s site data. This
        version includes no advertising trackers.
      </p>
      <h2>External contact</h2>
      <p>
        Phone and email links open your device’s apps. WhatsApp links take you
        to WhatsApp, where its own privacy terms apply. Roam does not store
        conversations that happen through those services.
      </p>
      <h2>Your controls</h2>
      <p>
        You can edit or pause your vehicle listings in your dashboard and log
        out to end your current session. Account deletion and automated data
        export are not yet available in this early version.
      </p>
    </article>
  );
}
