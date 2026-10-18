import { ROUTES } from '@/constants/routes';

export function sanitizeRedirect(target: string | null | undefined): string {
  if (!target || !target.startsWith('/') || target.startsWith('//') || target.startsWith('/\\')) {
    return ROUTES.HOME;
  }
  return target;
}
