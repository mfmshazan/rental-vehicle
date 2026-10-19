// Pure, client-safe calendar helpers shared by the availability calendars.
export const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const pad = (value: number) => String(value).padStart(2, "0");

export const iso = (year: number, month: number, day: number) =>
  `${year}-${pad(month + 1)}-${pad(day)}`;

// Today in Asia/Colombo as a YYYY-MM-DD string.
export const colomboTodayIso = () =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Colombo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

// The `count` months starting from the month that contains `todayIso`.
export function nextMonths(todayIso: string, count = 2) {
  const [year, month1] = todayIso.split("-").map(Number); // month1 is 1-based
  return Array.from({ length: count }, (_, i) => {
    const offset = month1 - 1 + i;
    return {
      year: year + Math.floor(offset / 12),
      month: ((offset % 12) + 12) % 12,
    };
  });
}

// A month as a human label plus day cells (null = leading blank before day 1).
export function monthMatrix(year: number, month: number) {
  const label = new Intl.DateTimeFormat("en-LK", {
    month: "long",
    year: "numeric",
  }).format(new Date(year, month, 1));
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (string | null)[] = [
    ...Array<null>(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => iso(year, month, i + 1)),
  ];
  return { label, cells };
}

// True when the day (YYYY-MM-DD) falls inside any inclusive period.
export const isWithin = (
  day: string,
  periods: { startDate: string; endDate: string }[],
) => periods.some((p) => day >= p.startDate && day <= p.endDate);
