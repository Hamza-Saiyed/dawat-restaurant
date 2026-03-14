import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isPublic = pathname === '/admin/login' || pathname === '/api/admin/auth/login'
  if (isPublic) return NextResponse.next()

  const isAdminRoute = pathname.startsWith('/admin') || pathname.startsWith('/api/admin')
  if (!isAdminRoute) return NextResponse.next()

  const token = request.cookies.get('dawat_admin_token')?.value
  if (!token) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*']
}
