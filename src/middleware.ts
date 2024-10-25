import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export const protectedRoutes = ['/'];
export const authRoutes = ['/signup', '/signin'];

export async function middleware({ cookies, nextUrl, url }: NextRequest) {
  const token = cookies.get('token')?.value;

  // if (url !== 'http://localhost:3000/signin')
  // console.log({ token, nextUrl, url });

  // If no token is found, redirect to the sign-in page
  if (!token && protectedRoutes.includes(nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/signin', url));
  } else if (token && authRoutes.includes(nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/', url));
    // try {
    //   // Validate token
    //   await verifyIdToken(token);
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
