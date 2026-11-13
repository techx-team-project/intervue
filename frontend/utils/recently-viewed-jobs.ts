const STORAGE_KEY = 'intervue:recently-viewed-jobs';
const CHANGE_EVENT = 'intervue:recently-viewed-change';
const MAX_ITEMS = 6;

export type RecentlyViewedJob = {
  id: number;
  title: string;
  companyName: string;
  city?: string;
};

export function readRecentlyViewedRaw(): string {
  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? '[]';
  } catch {
    return '[]';
  }
}

export function parseRecentlyViewedJobs(raw: string): RecentlyViewedJob[] {
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as RecentlyViewedJob[]).filter((job) => typeof job?.id === 'number') : [];
  } catch {
    return [];
  }
}

export function subscribeRecentlyViewed(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener('storage', onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener('storage', onChange);
  };
}

function write(value: string | null) {
  try {
    if (value === null) window.localStorage.removeItem(STORAGE_KEY);
    else window.localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // Storage can be blocked in private windows
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function rememberViewedJob(job: RecentlyViewedJob) {
  const rest = parseRecentlyViewedJobs(readRecentlyViewedRaw()).filter((item) => item.id !== job.id);
  write(JSON.stringify([job, ...rest].slice(0, MAX_ITEMS)));
}

export function clearRecentlyViewedJobs() {
  write(null);
}
