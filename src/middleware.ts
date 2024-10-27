import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export const protectedRoutes = ['/', '/appointments']; // Add specific protected routes here
export const authRoutes = ['/signup', '/signin'];

export async function middleware(request: NextRequest) {
  const { cookies, nextUrl } = request;
  const token = cookies.get('token')?.value;

  const isProtectedRoute = protectedRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  // Redirect to /signin if token is missing and accessing a protected route
  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  // Redirect to / if token exists and accessing an auth route
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Allow access if not restricted
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
