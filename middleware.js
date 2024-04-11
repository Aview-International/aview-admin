import { NextResponse } from 'next/server';
import { decodeJwt } from 'jose';

const authStatus = (token) => {
  if (!token) return false;
  const data = decodeJwt(token);
  if (!data) return false;
  const newDate = new Date(data.exp) * 1000;
  if (newDate < new Date().getTime()) return false;
  else {
    const newTime = newDate - new Date().getTime();
    return {
      newTime,
      data,
    };
  }
};

export default async function middleware(request) {
  const token = request.cookies.get('token')?.value;
  const status = authStatus(token);
  if (!status) {
    request.cookies.delete('token');
    return NextResponse.redirect(new URL('/', request.url));
  }
}

export const config = {
  matcher: [
    '/messages',
    '/admin-accounts',
    '/create-admin',
    '/dashboard',
    '/playground/:path*',
  ],
};
