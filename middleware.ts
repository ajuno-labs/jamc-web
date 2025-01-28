import { auth } from "@/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const session = await auth()

  if (request.nextUrl.pathname.startsWith("/(main)")) {
    if (!session) {
      return NextResponse.redirect(new URL("/(auth)/signin", request.url));
    }
  }
  if (session && (
    request.nextUrl.pathname.startsWith("/(auth)")
  )) {
    return NextResponse.redirect(new URL("/(main)", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}