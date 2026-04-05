/** Start of local calendar day */
export function startOfLocalDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function todayLocal(): Date {
  return startOfLocalDay(new Date());
}

/** Parse YYYY-MM-DD as local midnight */
export function parseLocalDate(ymd: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(ymd);
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]) - 1;
  const day = Number(m[3]);
  const d = new Date(y, mo, day);
  if (
    d.getFullYear() !== y ||
    d.getMonth() !== mo ||
    d.getDate() !== day
  ) {
    return null;
  }
  return d;
}

export function formatLocalYMD(d: Date): string {
  const y = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${mo}-${day}`;
}

export function isSameLocalDay(a: Date, b: Date): boolean {
  return formatLocalYMD(a) === formatLocalYMD(b);
}

export function isDueToday(dueAt: string | undefined): boolean {
  if (!dueAt) return false;
  const d = parseLocalDate(dueAt);
  if (!d) return false;
  return isSameLocalDay(d, todayLocal());
}

/** Due date is strictly after today (end of day) */
export function isUpcomingDue(dueAt: string | undefined): boolean {
  if (!dueAt) return false;
  const d = parseLocalDate(dueAt);
  if (!d) return false;
  const t = todayLocal();
  return d.getTime() > t.getTime();
}

export type DateGroupKey =
  | "overdue"
  | "today"
  | "tomorrow"
  | "this_week"
  | "later"
  | "no_date";

export function groupKeyForDueDate(dueAt: string | undefined): DateGroupKey {
  if (!dueAt) return "no_date";
  const d = parseLocalDate(dueAt);
  if (!d) return "no_date";
  const today = todayLocal();
  const diffDays = Math.floor(
    (startOfLocalDay(d).getTime() - today.getTime()) / 86400000,
  );
  if (diffDays < 0) return "overdue";
  if (diffDays === 0) return "today";
  if (diffDays === 1) return "tomorrow";
  if (diffDays >= 2 && diffDays <= 6) return "this_week";
  return "later";
}

export const GROUP_ORDER: DateGroupKey[] = [
  "overdue",
  "today",
  "tomorrow",
  "this_week",
  "later",
  "no_date",
];

export const GROUP_LABELS: Record<DateGroupKey, string> = {
  overdue: "Overdue",
  today: "Today",
  tomorrow: "Tomorrow",
  this_week: "This week",
  later: "Later",
  no_date: "No date",
};
