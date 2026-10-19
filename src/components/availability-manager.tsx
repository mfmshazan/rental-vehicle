"use client";
import { useActionState, useState } from "react";
import {
  addBlockedPeriodAction,
  removeBlockedPeriodAction,
} from "@/app/actions";
import {
  WEEKDAYS,
  colomboTodayIso,
  isWithin,
  monthMatrix,
  nextMonths,
} from "@/lib/calendar";
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

      {/* Keyed by the number of periods so a successful add remounts the
          picker and clears the selection without a setState-in-effect. */}
      <BlockPicker key={periods.length} vehicleId={vehicleId} periods={periods} />
    </section>
  );
}

function BlockPicker({
  vehicleId,
  periods,
}: {
  vehicleId: string;
  periods: Period[];
}) {
  const [state, action, pending] = useActionState(addBlockedPeriodAction, {});
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const today = colomboTodayIso();
  const months = nextMonths(today);

  function pickDay(day: string) {
    if (!from || (from && to)) {
      setFrom(day);
      setTo("");
    } else if (day >= from) {
      setTo(day);
    } else {
      setFrom(day);
    }
  }

  return (
    <>
      <div className="availability-calendar">
        <p className="blocked-empty">
          Tap a start day, then an end day, to select a range.
        </p>
        <div className="calendar-months">
          {months.map(({ year, month }) => {
            const { label, cells } = monthMatrix(year, month);
            return (
              <div className="calendar-month" key={`${year}-${month}`}>
                <h4>{label}</h4>
                <div className="calendar-grid">
                  {WEEKDAYS.map((day) => (
                    <span className="calendar-head" key={day}>
                      {day}
                    </span>
                  ))}
                  {cells.map((day, index) => {
                    if (day === null)
                      return (
                        <span key={index} className="calendar-cell empty" />
                      );
                    const dayNo = Number(day.slice(8));
                    const blocked = isWithin(day, periods);
                    const past = day < today;
                    if (past || blocked)
                      return (
                        <span
                          key={index}
                          className={`calendar-cell ${past ? "past" : "blocked"}`}
                        >
                          {dayNo}
                        </span>
                      );
                    const selected = day === from || day === to;
                    const inRange = Boolean(to) && day > from && day < to;
                    return (
                      <button
                        type="button"
                        key={index}
                        onClick={() => pickDay(day)}
                        className={`calendar-cell free selectable${
                          selected ? " selected" : inRange ? " in-range" : ""
                        }`}
                        aria-pressed={selected || inRange}
                      >
                        {dayNo}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <ActionForm action={action} className="blocked-add">
        <input type="hidden" name="vehicleId" value={vehicleId} />
        <div className="form-grid">
          <label>
            Unavailable from
            <input
              type="date"
              name="startDate"
              min={today}
              value={from}
              onChange={(event) => {
                setFrom(event.target.value);
                if (to && event.target.value > to) setTo("");
              }}
              required
            />
          </label>
          <label>
            Unavailable to
            <input
              type="date"
              name="endDate"
              min={from || today}
              value={to}
              onChange={(event) => setTo(event.target.value)}
              required
            />
          </label>
        </div>
        {state.error && (
          <p className="form-message error" role="alert">
            {state.error}
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
    </>
  );
}
