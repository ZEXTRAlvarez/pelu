import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const isAuth = !!token;
  const isAuthPage = request.nextUrl.pathname === '/signin';

  // Si el usuario está autenticado y trata de acceder a la página de inicio de sesión,
  // redirigir a la página principal
  if (isAuth && isAuthPage) {
    return NextResponse.redirect(new URL('/homepage', request.url));
  }

  // Si el usuario no está autenticado y trata de acceder a una página protegida,
  // redirigir a la página de inicio de sesión
  if (!isAuth && !isAuthPage) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/homepage/:path*', '/signin']
}; 