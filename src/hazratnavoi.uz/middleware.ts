import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ADMIN_USERNAME = 'admin'
const ADMIN_PASSWORD = 'xazrat123'

export function middleware(request: NextRequest) {
  // Проверяем, что это админ-панель
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Получаем куки
    const authCookie = request.cookies.get('admin-auth')?.value
    
    // Если куки нет или она неверная
    if (!authCookie || authCookie !== btoa(`${ADMIN_USERNAME}:${ADMIN_PASSWORD}`)) {
      // Перенаправляем на страницу логина
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}
