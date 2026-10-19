"use client";
import { useMemo } from "react";
import {
  WEEKDAYS,
  colomboTodayIso,
  isWithin,
  monthMatrix,
  nextMonths,
} from "@/lib/calendar";

type Period = { startDate: string; endDate: string };

export function AvailabilityCalendar({ blocked }: { blocked: Period[] }) {
  const today = useMemo(() => colomboTodayIso(), []);
  const months = nextMonths(today);

  return (
    <div className="availability-calendar">
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
                    return <span key={index} className="calendar-cell empty" />;
                  const classes = ["calendar-cell"];
                  if (day < today) classes.push("past");
                  else classes.push(isWithin(day, blocked) ? "blocked" : "free");
                  if (day === today) classes.push("today");
                  return (
                    <span
                      key={index}
                      className={classes.join(" ")}
                      title={
                        day >= today && isWithin(day, blocked)
                          ? "Unavailable"
                          : undefined
                      }
                    >
                      {Number(day.slice(8))}
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
