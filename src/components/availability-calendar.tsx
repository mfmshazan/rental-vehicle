"use client";
import { useMemo } from "react";

type Period = { startDate: string; endDate: string };

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const pad = (value: number) => String(value).padStart(2, "0");

export function AvailabilityCalendar({ blocked }: { blocked: Period[] }) {
  const today = useMemo(
    () =>
      new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Colombo",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(new Date()),
    [],
  );
  const [ty, tm] = today.split("-").map(Number); // tm is 1-based
  const months = [
    { year: ty, month: tm - 1 },
    { year: tm === 12 ? ty + 1 : ty, month: tm === 12 ? 0 : tm },
  ];
  const isBlocked = (iso: string) =>
    blocked.some((period) => iso >= period.startDate && iso <= period.endDate);

  return (
    <div className="availability-calendar">
      <div className="calendar-months">
        {months.map(({ year, month }) => {
          const label = new Intl.DateTimeFormat("en-LK", {
            month: "long",
            year: "numeric",
          }).format(new Date(year, month, 1));
          const firstWeekday = new Date(year, month, 1).getDay();
          const daysInMonth = new Date(year, month + 1, 0).getDate();
          const cells: (number | null)[] = [
            ...Array(firstWeekday).fill(null),
            ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
          ];
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
                    return <span key={index} className="calendar-cell empty" />;
                  const iso = `${year}-${pad(month + 1)}-${pad(day)}`;
                  const classes = ["calendar-cell"];
                  if (iso < today) classes.push("past");
                  else classes.push(isBlocked(iso) ? "blocked" : "free");
                  if (iso === today) classes.push("today");
                  return (
                    <span
                      key={index}
                      className={classes.join(" ")}
                      title={
                        iso >= today && isBlocked(iso) ? "Unavailable" : undefined
                      }
                    >
                      {day}
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <div className="calendar-legend">
        <span>
          <i className="swatch free" /> Available
        </span>
        <span>
          <i className="swatch blocked" /> Unavailable
        </span>
        <span>
          <i className="swatch today" /> Today
        </span>
      </div>
    </div>
  );
}
