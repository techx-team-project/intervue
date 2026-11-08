import type { InterviewFormat } from '@/types/interview';

const STORAGE_KEY = 'intervue:interview-preferences';

export interface InterviewPreferences {
  durationMinutes: number;
  format: InterviewFormat;
  location: string;
}

export function loadInterviewPreferences(): InterviewPreferences | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as InterviewPreferences) : null;
  } catch {
    return null;
  }
}

export function saveInterviewPreferences(preferences: InterviewPreferences) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  } catch {
    return;
  }
}
