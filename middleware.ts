import { auth } from "@/auth";
import { NextResponse } from "next/server";
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

// Create the i18n middleware
const intlMiddleware = createMiddleware(routing);

export default auth((req) => {
  // Handle internationalization first
  const response = intlMiddleware(req);
  
  // If i18n middleware returns a response (redirect), use it
  if (response) {
    return response;
  }

  // Extract locale from pathname for auth logic
  const pathname = req.nextUrl.pathname;
  const pathnameHasLocale = routing.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  
  // Strip locale from pathname for auth checks
  const pathWithoutLocale = pathnameHasLocale 
    ? pathname.replace(/^\/[^\/]+/, '') || '/'
    : pathname;

  // Root path - allow both localized and non-localized
  if (pathWithoutLocale === "/") {
    return NextResponse.next();
  }

  // Auth pages - redirect to home if already authenticated
  if (pathWithoutLocale.startsWith("/signin") || pathWithoutLocale.startsWith("/signup")) {
    if (req.auth) {
      // Redirect to localized home page
      const locale = pathnameHasLocale ? pathname.split('/')[1] : routing.defaultLocale;
      return NextResponse.redirect(new URL(`/${locale}`, req.url));
    } else {
      return NextResponse.next();
    }
  }

  // Protected routes - require authentication
  if (!req.auth) {
    const locale = pathnameHasLocale ? pathname.split('/')[1] : routing.defaultLocale;
    const signInUrl = new URL(`/${locale}/signin`, req.url);
    signInUrl.searchParams.set("callbackUrl", pathname + req.nextUrl.search);
    return NextResponse.redirect(signInUrl);
  }
  
  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};