import { RECRUITER_REFRESH_COOKIE_NAME, REFRESH_COOKIE_NAME } from '@/constants/auth';
import { RECRUITER_AREA_PREFIX, REDIRECT_PARAM, ROUTES } from '@/constants/routes';
import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_RECRUITER_PATHS: readonly string[] = [
  ROUTES.RECRUITER_LANDING,
  ROUTES.RECRUITER_LOGIN,
  ROUTES.RECRUITER_REGISTER,
  ROUTES.RECRUITER_ONBOARDING,
];

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const normalizedPath = pathname.endsWith('/') && pathname.length > 1 ? pathname.slice(0, -1) : pathname;

  if (PUBLIC_RECRUITER_PATHS.includes(normalizedPath)) {
    return NextResponse.next();
  }

  const isRecruiterArea = pathname.startsWith(RECRUITER_AREA_PREFIX);
  const sessionCookie = isRecruiterArea ? RECRUITER_REFRESH_COOKIE_NAME : REFRESH_COOKIE_NAME;
  if (request.cookies.has(sessionCookie)) return NextResponse.next();

  const loginPath = isRecruiterArea ? ROUTES.RECRUITER_LOGIN : ROUTES.LOGIN;

  const loginUrl = new URL(loginPath, request.url);
  loginUrl.searchParams.set(REDIRECT_PARAM, pathname + search);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/candidate/:path*', '/account/:path*', '/recruiter/:path*', '/admin/:path*'],
};
