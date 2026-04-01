import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ADMIN_USERNAME = 'admin'
const ADMIN_PASSWORD = 'xazrat123'

// Server-side Base64 encoding
function encodeBase64(str: string): string {
  return Buffer.from(str, 'utf-8').toString('base64')
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Проверяем, что это админ-панель (но не логин)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    // Получаем куки
    const authCookie = request.cookies.get('admin-auth')?.value

    // Если куки нет или она неверная
    if (!authCookie || authCookie !== encodeBase64(`${ADMIN_USERNAME}:${ADMIN_PASSWORD}`)) {
      // Перенаправляем на страницу логина
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}
