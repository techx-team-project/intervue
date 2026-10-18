import { REFRESH_COOKIE_NAME } from '@/constants/auth';
import { REDIRECT_PARAM, ROUTES } from '@/constants/routes';
import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  if (request.cookies.has(REFRESH_COOKIE_NAME)) return NextResponse.next();

  const loginUrl = new URL(ROUTES.LOGIN, request.url);
  loginUrl.searchParams.set(REDIRECT_PARAM, request.nextUrl.pathname + request.nextUrl.search);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/candidate/:path*', '/account/:path*', '/recruiter/:path*'],
};
