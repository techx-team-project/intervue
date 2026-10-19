const TIME_ZONE = 'Asia/Ho_Chi_Minh';
const DAY_MS = 86_400_000;

const dateFormatter = new Intl.DateTimeFormat('vi-VN', {
  timeZone: TIME_ZONE,
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

const dateTimeFormatter = new Intl.DateTimeFormat('vi-VN', {
  timeZone: TIME_ZONE,
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

const weekdayFormatter = new Intl.DateTimeFormat('vi-VN', {
  timeZone: TIME_ZONE,
  weekday: 'long',
  day: '2-digit',
  month: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
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

function startOfDayInTimeZone(value: Date): number {
  const parts = dateFormatter.formatToParts(value);
  const day = parts.find((part) => part.type === 'day')?.value ?? '01';
  const month = parts.find((part) => part.type === 'month')?.value ?? '01';
  const year = parts.find((part) => part.type === 'year')?.value ?? '1970';
  return Date.parse(`${year}-${month}-${day}T00:00:00Z`);
}

export function dayDifferenceFromToday(iso: string): number {
  return Math.round((startOfDayInTimeZone(new Date(iso)) - startOfDayInTimeZone(new Date())) / DAY_MS);
}

export function formatRelativeDay(iso: string): string {
  const difference = dayDifferenceFromToday(iso);

  if (difference === 0) return 'Hôm nay';
  if (difference === -1) return 'Hôm qua';
  if (difference === 1) return 'Ngày mai';
  if (difference < 0) return `${Math.abs(difference)} ngày trước`;
  return `Còn ${difference} ngày`;
}
