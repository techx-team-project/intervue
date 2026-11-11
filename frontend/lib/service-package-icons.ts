export interface ServiceSectionIconOption {
  value: string;
  label: string;
}

export const SERVICE_SECTION_ICON_OPTIONS: readonly ServiceSectionIconOption[] = [
  { value: 'sparkles', label: 'Sparkles (Highlight)' },
  { value: 'zap', label: 'Zap (Boost / Fast)' },
  { value: 'award', label: 'Award (VIP / Top)' },
  { value: 'trending-up', label: 'Trending Up (Reach)' },
  { value: 'target', label: 'Target (Matching)' },
  { value: 'megaphone', label: 'Megaphone (Branding / Ads)' },
  { value: 'shield-check', label: 'Shield Check (Guarantee)' },
  { value: 'gift', label: 'Gift (Bonus / Credits)' },
  { value: 'layers', label: 'Layers (Features)' },
  { value: 'users', label: 'Users (Candidates)' },
  { value: 'bar-chart-3', label: 'Bar Chart (Analytics)' },
  { value: 'clock', label: 'Clock (Duration)' },
  { value: 'star', label: 'Star (Featured)' },
  { value: 'check-circle-2', label: 'Check Circle (Included)' },
];

export function normalizeServiceSectionIconKey(raw: string): string {
  return raw
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[_\s]+/g, '-')
    .toLowerCase();
}
