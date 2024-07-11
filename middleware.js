import { NextResponse } from 'next/server';
import { checkTokenExpiry } from './utils/jwtExpiry';

export async function middleware(request) {
  const currentUrl = request.url;
  const response = NextResponse.redirect(new URL('/?rdr=true', currentUrl));
  const sessionCookie = request.cookies.get('token')?.value;

  try {
    if (!checkTokenExpiry(sessionCookie)) {
      response.cookies.set('redirectUrl', currentUrl);
      return response;
    }
  } catch (error) {
    response.cookies.set('redirectUrl', currentUrl);
    return response;
  }
}

export const config = {
  matcher: [
    '/dashboard',
    '/admin-accounts',
    '/creator-accounts',
    '/inquiries',
    '/creator-enquiries',
    '/history',
    '/playground/:path*',
  ],
};
