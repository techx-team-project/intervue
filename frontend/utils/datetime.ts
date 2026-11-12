const TIME_ZONE = 'Asia/Ho_Chi_Minh';
const DAY_MS = 86_400_000;

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: TIME_ZONE,
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

const dateTimeFormatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: TIME_ZONE,
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

const weekdayFormatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: TIME_ZONE,
  weekday: 'long',
  day: '2-digit',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

const isoDatePartsFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

export function formatDate(iso: string): string {
  return dateFormatter.format(new Date(iso));
}

export function formatDateTime(iso: string): string {
  return dateTimeFormatter.format(new Date(iso));
}

export function formatInterviewMoment(iso: string): string {
  return weekdayFormatter.format(new Date(iso));
}

export function todayIsoDate(): string {
  const parts = isoDatePartsFormatter.formatToParts(new Date());
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((item) => item.type === type)?.value ?? '';
  return `${part('year')}-${part('month')}-${part('day')}`;
}

function startOfDayInTimeZone(value: Date): number {
  const parts = dateFormatter.formatToParts(value);
  const day = parts.find((part) => part.type === 'day')?.value ?? '01';
  const month = parts.find((part) => part.type === 'month')?.value ?? 'Jan';
  const year = parts.find((part) => part.type === 'year')?.value ?? '1970';
  return Date.parse(`${day} ${month} ${year} 00:00:00 GMT`);
}

export function dayDifferenceFromToday(iso: string): number {
  return Math.round((startOfDayInTimeZone(new Date(iso)) - startOfDayInTimeZone(new Date())) / DAY_MS);
}

const VIETNAM_OFFSET_MS = 7 * 60 * 60 * 1000;

export function toLocalInputValue(iso: string): string {
  return new Date(new Date(iso).getTime() + VIETNAM_OFFSET_MS).toISOString().slice(0, 16);
}

export function fromLocalInputValue(value: string): string {
  return new Date(`${value}:00+07:00`).toISOString();
}

export function currentLocalInputValue(): string {
  return toLocalInputValue(new Date().toISOString());
}

export function formatRelativeDay(iso: string): string {
  const difference = dayDifferenceFromToday(iso);

  if (difference === 0) return 'Today';
  if (difference === -1) return 'Yesterday';
  if (difference === 1) return 'Tomorrow';
  if (difference < 0) return `${Math.abs(difference)} days ago`;
  return `In ${difference} days`;
}

export function isoDateAfterDays(days: number): string {
  const date = new Date(`${todayIsoDate()}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function localInputValueAfterDays(days: number): string {
  return toLocalInputValue(new Date(Date.now() + days * DAY_MS).toISOString());
}
