import { currentLocalInputValue } from '@/utils/datetime';

export interface QuickSlot {
  label: string;
  value: string;
}

const DAY_MS = 24 * 60 * 60 * 1000;
const MONDAY = 1;
const DAYS_PER_WEEK = 7;

function at(base: Date, dayOffset: number, hour: number): string {
  const moment = new Date(base.getTime() + dayOffset * DAY_MS);
  moment.setUTCHours(hour, 0, 0, 0);
  return moment.toISOString().slice(0, 16);
}

export function buildQuickSlots(): QuickSlot[] {
  const now = currentLocalInputValue();
  const base = new Date(`${now}:00Z`);
  const untilMonday = ((MONDAY - base.getUTCDay() + DAYS_PER_WEEK - 1) % DAYS_PER_WEEK) + 1;

  return [
    { label: 'Ngày mai 09:00', value: at(base, 1, 9) },
    { label: 'Ngày mai 14:00', value: at(base, 1, 14) },
    { label: 'Ngày kia 10:00', value: at(base, 2, 10) },
    { label: 'Thứ Hai tới 09:00', value: at(base, untilMonday, 9) },
  ].filter((slot) => slot.value > now);
}
