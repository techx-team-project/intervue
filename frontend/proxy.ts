import { ADMIN_REFRESH_COOKIE_NAME, RECRUITER_REFRESH_COOKIE_NAME, REFRESH_COOKIE_NAME } from '@/constants/auth';
import { RECRUITER_AREA_PREFIX, REDIRECT_PARAM, ROUTES } from '@/constants/routes';
import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_PATHS: readonly string[] = [
  ROUTES.RECRUITER_LANDING,
  ROUTES.RECRUITER_LOGIN,
  ROUTES.RECRUITER_REGISTER,
  ROUTES.RECRUITER_ONBOARDING,
  ROUTES.RECRUITER_FORGOT_PASSWORD,
  ROUTES.RECRUITER_RESET_PASSWORD,
  ROUTES.RECRUITER_VERIFY_EMAIL,
  ROUTES.RECRUITER_CONFIRM_EMAIL_CHANGE,
  ROUTES.ADMIN_LOGIN,
];

const STATIC_FILE_REGEX = /\.(png|jpg|jpeg|gif|svg|webp|ico|woff|woff2|ttf|css|js)$/i;

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Never intercept static files
  if (STATIC_FILE_REGEX.test(pathname)) {
    return NextResponse.next();
  }

  const normalizedPath = pathname.endsWith('/') && pathname.length > 1 ? pathname.slice(0, -1) : pathname;

  if (PUBLIC_PATHS.includes(normalizedPath)) {
    return NextResponse.next();
  }

  // Admin Area
  if (pathname.startsWith('/admin')) {
    if (request.cookies.has(ADMIN_REFRESH_COOKIE_NAME)) {
      return NextResponse.next();
    }
    const loginUrl = new URL(ROUTES.ADMIN_LOGIN, request.url);
    loginUrl.searchParams.set(REDIRECT_PARAM, pathname + search);
    return NextResponse.redirect(loginUrl);
  }

  // Recruiter Area
  const isRecruiterArea = pathname.startsWith(RECRUITER_AREA_PREFIX);
  if (isRecruiterArea) {
    if (request.cookies.has(RECRUITER_REFRESH_COOKIE_NAME)) {
      return NextResponse.next();
    }
    const loginUrl = new URL(ROUTES.RECRUITER_LOGIN, request.url);
    loginUrl.searchParams.set(REDIRECT_PARAM, pathname + search);
    return NextResponse.redirect(loginUrl);
  }

  // Candidate / Default Protected Area
  if (request.cookies.has(REFRESH_COOKIE_NAME)) {
    return NextResponse.next();
  }
  const loginUrl = new URL(ROUTES.LOGIN, request.url);
  loginUrl.searchParams.set(REDIRECT_PARAM, pathname + search);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/candidate/:path*', '/account/:path*', '/recruiter/:path*', '/admin/:path*'],
};
