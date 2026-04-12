import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

const PUBLIC_ONLY_ROUTES = ['/', '/login', '/register', '/forgot-password'];

export function proxy(request: NextRequest) {
  const token = request.cookies.get('authToken')?.value;
  const isValid = token ? verifyToken(token) !== null : false;

  const { pathname } = request.nextUrl;

  const isPublicOnly = PUBLIC_ONLY_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  );

  // Logged in + trying to access public-only pages → redirect to dashboard
  if (isValid && isPublicOnly) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Not logged in + trying to access dashboard → redirect to login
  if (!isValid && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};