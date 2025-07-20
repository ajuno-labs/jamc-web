/**
 * Configuration for application routes
 */

export const PUBLIC_ROUTES = ["/signin", "/signup", "/onboarding"] as const;

/**
 * Check if a given pathname is a public route
 * @param pathname - The pathname to check
 * @returns True if the pathname is a public route
 */
export function isPublicRoute(pathname: string): boolean {
  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    return true;
  }
  const strippedPath = pathname.replace(/^\/[a-z]{2}(-[A-Z]{2})?/, "");
  return PUBLIC_ROUTES.some((route) => strippedPath.startsWith(route));
}
