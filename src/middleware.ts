import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export const protectedRoutes = ['/'];
export const authRoutes = ['/signup', '/signin'];

export async function middleware({ cookies, nextUrl, url }: NextRequest) {
  const token = cookies.get('token')?.value;

  if (!token && protectedRoutes.includes(nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/signin', url));
  } else if (token && authRoutes.includes(nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/', url));
    // try {
    //   // Validate token
    //   await verifyIdToken(token);

    //   if(authRoutes.includes(nextUrl.pathname)) {
    //     return NextResponse.redirect(new URL('/', url));
    //   }
    //   return NextResponse.next(); // Allow access if token is valid
    // } catch (e) {
    //   console.log(e);

    //   // If token is invalid, redirect to sign-in
    //   return NextResponse.redirect(new URL('/signin', url));
    // }
  } else {
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
