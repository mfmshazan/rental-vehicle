"use client";
import { useActionState } from "react";
import {
  addBlockedPeriodAction,
  removeBlockedPeriodAction,
} from "@/app/actions";
import { Icon } from "./icon";
import { ActionForm } from "./action-form";

type Period = { id: string; startDate: string; endDate: string };

function formatRange(start: string, end: string) {
  const format = (value: string) =>
    new Intl.DateTimeFormat("en-LK", {
      dateStyle: "medium",
      timeZone: "Asia/Colombo",
    }).format(new Date(`${value}T00:00:00+05:30`));
  return start === end ? format(start) : `${format(start)} → ${format(end)}`;
}

export function AvailabilityManager({
  vehicleId,
  periods,
}: {
  vehicleId: string;
  periods: Period[];
}) {
  const [state, action, pending] = useActionState(addBlockedPeriodAction, {});
  return (
    <section className="availability-manager form-section">
      <div className="form-section-heading">
        <span>★</span>
        <div>
          <h2>Availability</h2>
          <p>
            Block the dates your vehicle is already booked or off the road.
            Renters see these on your listing; everything else shows as
            available.
          </p>
        </div>
      </div>
      {periods.length > 0 ? (
        <ul className="blocked-list">
          {periods.map((period) => (
            <li key={period.id}>
              <span>{formatRange(period.startDate, period.endDate)}</span>
              <form action={removeBlockedPeriodAction}>
                <input type="hidden" name="id" value={period.id} />
                <input type="hidden" name="vehicleId" value={vehicleId} />
                <button className="text-link" type="submit">
                  Remove
                </button>
              </form>
            </li>
          ))}
        </ul>
      ) : (
        <p className="blocked-empty">
          No blocked dates yet — your vehicle shows as fully available.
        </p>
      )}
      <ActionForm action={action} className="blocked-add">
        <input type="hidden" name="vehicleId" value={vehicleId} />
        <div className="form-grid">
          <label>
            Unavailable from
            <input type="date" name="startDate" required />
          </label>
          <label>
            Unavailable to
            <input type="date" name="endDate" required />
          </label>
        </div>
        {state.error && (
          <p className="form-message error" role="alert">
            {state.error}
          </p>
        )}
        {state.success && (
          <p className="form-message success" role="status">
            {state.success}
          </p>
        )}
        <button
          className="button button-outline"
          disabled={pending}
          type="submit"
        >
          <Icon name="plus" size={16} />
          {pending ? "Saving…" : "Block these dates"}
        </button>
      </ActionForm>
    </section>
  );
}
