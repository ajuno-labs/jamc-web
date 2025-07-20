import { auth } from "@/auth";
import { NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { isPublicRoute } from "@/lib/config/routes";

const intlMiddleware = createMiddleware(routing);

export default auth(async (req) => {
  const response = intlMiddleware(req);

  if (!req.auth && !isPublicRoute(req.nextUrl.pathname)) {
    const signinUrl = new URL("/signin", req.url);
    signinUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(signinUrl.toString());
  }

  return response;
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
