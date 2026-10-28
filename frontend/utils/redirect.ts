import { ROUTES } from '@/constants/routes';

const PARSE_BASE = 'https://intervue.invalid';

function sameOriginPath(target: string): string | null {
  try {
    const parsed = new URL(target, PARSE_BASE);
    return parsed.origin === PARSE_BASE ? `${parsed.pathname}${parsed.search}${parsed.hash}` : null;
  } catch {
    return null;
  }
}

export function sanitizeRedirect(target: string | null | undefined, fallback: string = ROUTES.HOME): string {
  if (!target || !target.startsWith('/')) return fallback;
  const path = sameOriginPath(target);
  return path !== null && sameOriginPath(path) === path ? path : fallback;
}
