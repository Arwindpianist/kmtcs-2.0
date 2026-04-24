import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function proxy(req: NextRequest) {
  return NextResponse.next()
}

// Specify which routes should be protected
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api
     * - _next/static
     * - _next/image
     * - favicon.ico
     * - public
     * - / (homepage)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public|$).*)',
  ],
}