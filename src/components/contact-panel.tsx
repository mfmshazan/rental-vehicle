"use client";
import { useActionState, useState } from "react";
import Link from "next/link";
import { inquiryAction } from "@/app/actions";
import { money } from "@/lib/marketplace";
import { Icon } from "./icon";
import { ActionForm } from "./action-form";

export function ContactPanel({
  id,
  title,
  dailyRate,
  ownerName,
  phone,
  demo,
}: {
  id: string;
  title: string;
  dailyRate: number;
  ownerName: string;
  phone: string | null;
  demo: boolean;
}) {
  const [state, action, pending] = useActionState(
    inquiryAction.bind(null, id),
    {},
  );
  const [showForm, setShowForm] = useState(false);
  const normalized = phone?.replace(/\D/g, "").replace(/^0/, "94");
  return (
    <aside className="contact-panel">
      <div className="contact-price">
        <strong>Rs. {money(dailyRate)}</strong>
        <span> / day</span>
      </div>
      <p className="contact-price-note">
        Agree the final price and terms with the owner.
      </p>
      <div className="contact-owner">
        <span className="avatar large">{ownerName[0]}</span>
        <div>
          <span>Listed by</span>
          <strong>{ownerName}</strong>
          <small>{demo ? "Example owner" : "Vehicle owner"}</small>
        </div>
      </div>
      {demo ? (
        <div className="demo-contact">
          <span className="pill">DEMO LISTING</span>
          <h3>A little inspiration for your next trip.</h3>
          <p>
            This is a sample listing with an illustrative photo. This vehicle
            cannot be rented or contacted.
          </p>
          <Link
            href="/list-your-car"
            className="button button-green full-width"
          >
            List a real vehicle <Icon name="northeast" size={17} />
          </Link>
        </div>
      ) : (
        <>
          <div className="contact-buttons">
            {normalized && (
              <>
                <a
                  className="button button-green full-width"
                  href={`https://wa.me/${normalized}?text=${encodeURIComponent(`Hi ${ownerName}, I found your ${title} on Roam. I'd like to ask about availability and rental details.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon name="chat" size={19} /> Chat on WhatsApp{" "}
                  <Icon name="northeast" size={16} />
                </a>
                <a
                  className="button button-outline full-width"
                  href={`tel:+${normalized}`}
                >
                  <Icon name="phone" size={18} />
                  {phone}
                </a>
              </>
            )}
            <button
              className="text-link send-inquiry"
              onClick={() => setShowForm(!showForm)}
              aria-expanded={showForm}
            >
              <Icon name="mail" size={16} />
              {showForm ? "Close inquiry form" : "Prefer to send an inquiry?"}
            </button>
          </div>
          {showForm && (
            <ActionForm action={action} className="form-stack inquiry-form">
              <h3>Ask about this vehicle</h3>
              <label>
                Your name
                <input
                  name="name"
                  autoComplete="name"
                  required
                  minLength={2}
                  maxLength={80}
                />
              </label>
              <label>
                Email
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                />
              </label>
              <label>
                Mobile number
                <input
                  type="tel"
                  name="phone"
                  placeholder="077 123 4567"
                  autoComplete="tel"
                  required
                />
              </label>
              <div className="form-grid">
                <label>
                  Pickup date
                  <input type="date" name="startDate" required />
                </label>
                <label>
                  Return date
                  <input type="date" name="endDate" required />
                </label>
              </div>
              <label>
                Your message
                <textarea
                  name="message"
                  rows={3}
                  minLength={10}
                  maxLength={1500}
                  placeholder="Tell the owner about your plans…"
                  required
                />
              </label>
              <input
                className="honeypot"
                name="website"
                aria-hidden="true"
                tabIndex={-1}
                autoComplete="off"
              />
              {state.error && (
                <p className="form-message error" role="alert">
                  {state.error}
                </p>
              )}
              {state.success ? (
                <p className="form-message success" role="status">
                  {state.success}
                </p>
              ) : (
                <button
                  className="button button-green full-width"
                  disabled={pending}
                >
                  {pending ? "Sending…" : "Send inquiry"}
                  <Icon name="arrow" size={17} />
                </button>
              )}
              <p className="fine-print">
                Your contact details and message will be shared with this owner.
                Sending an inquiry does not reserve the vehicle.
              </p>
            </ActionForm>
          )}
        </>
      )}
      <div className="contact-footnote">
        <Icon name="shield" size={18} />
        <p>
          Confirm availability, insurance, deposit, and mileage before you
          agree. <Link href="/guidelines">Rental guidelines</Link>
        </p>
      </div>
    </aside>
  );
}
