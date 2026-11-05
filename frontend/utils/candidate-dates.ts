const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const toMonthValue = (date: string | null): string => (date ? date.slice(0, 7) : '');

export const toFirstOfMonth = (month: string): string | null => (month === '' ? null : `${month}-01`);

export function formatMonth(date: string | null): string | null {
  if (!date) return null;
  const [year, month] = date.split('-');
  const name = MONTH_NAMES[Number(month) - 1];
  return name ? `${name} ${year}` : null;
}

export function formatDateRange(startDate: string, endDate: string | null, current: boolean, currentLabel: string) {
  const end = current ? currentLabel : formatMonth(endDate);
  return end ? `${formatMonth(startDate)} - ${end}` : (formatMonth(startDate) ?? '');
}

export function formatYearRange(startYear: number, endYear: number | null): string {
  return endYear === null ? `${startYear}` : `${startYear} - ${endYear}`;
}
