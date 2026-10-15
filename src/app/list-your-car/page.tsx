import Link from "next/link";
import { auth } from "@/auth";
import { VehicleForm } from "@/components/vehicle-form";
import { Icon } from "@/components/icon";
export const metadata = { title: "List your vehicle" };
export default async function ListVehiclePage() {
  const session = await auth();
  return (
    <div className="container owner-page">
      <div className="page-heading">
        <div className="eyebrow">FOR THE OWNERS. FOR THE OPPORTUNITIES.</div>
        <h1>
          Your next chapter
          <br />
          starts in your driveway.
        </h1>
        <p>List your vehicle. Set your rate. Connect directly with renters.</p>
      </div>
      {session ? (
        <div className="editor-layout">
          <VehicleForm />
          <aside className="owner-tips">
            <span className="tip-icon">
              <Icon name="sun" size={28} />
            </span>
            <h3>A great listing goes a long way.</h3>
            <p>
              Take your photo in daylight, include the whole vehicle, and keep
              the background simple.
            </p>
            <hr />
            <h4>Clear details. Better connections.</h4>
            <p>
              Be upfront about mileage limits, insurance, deposits, and what
              your daily rate includes.
            </p>
            <Link href="/guidelines" className="text-link">
              Owner guidelines <Icon name="arrow" size={16} />
            </Link>
          </aside>
        </div>
      ) : (
        <div className="owner-welcome">
          <div className="owner-benefits">
            {[
              [
                "car",
                "A listing that does the talking",
                "Add your vehicle details, a photo, and your daily rate.",
              ],
              [
                "chat",
                "Real conversations, directly",
                "Customers contact you by phone, WhatsApp, or an inquiry.",
              ],
              [
                "key",
                "You’re in control",
                "Agree your own rental terms. Edit or pause your listing whenever you like.",
              ],
            ].map(([icon, title, description]) => (
              <div key={title}>
                <span className="step-icon">
                  <Icon name={icon} size={24} />
                </span>
                <div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="owner-start-card">
            <span className="eyebrow">LET’S GET YOU STARTED</span>
            <h2>
              More possibilities.
              <br />
              Zero listing fees.
            </h2>
            <p>Create a free owner account to publish your first vehicle.</p>
            <Link href="/register" className="button button-green full-width">
              Create owner account <Icon name="arrow" size={17} />
            </Link>
            <p className="auth-switch">
              Already have an account? <Link href="/login">Log in</Link>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
