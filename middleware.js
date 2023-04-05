import { NextResponse } from 'next/server';
import { decodeJwt } from 'jose';
import Cookies from 'js-cookie';

const authStatus = async (token) => {
  if (!token) return false;
  else {
    if (await !decodeJwt(token)) console.log(false);
    // console.log('hereeee');
    // console.log(data ? true : false);
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
  }
};

export default async function middleware(request) {
  const token = request.cookies.get('token')?.value;
  // const token = request.cookies.get('token');

  // console.log(token);
  const status = await authStatus(token);
  if (!status) {
    request.cookies.delete('token');
    return NextResponse.redirect(new URL('/', request.url));
  }
}

export const config = {
  matcher: ['/messages', '/admin-accounts', '/create-admin', '/dashboard'],
};
