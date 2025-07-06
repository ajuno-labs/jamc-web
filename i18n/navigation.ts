import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';
import { getLocale } from 'next-intl/server';

export const { Link, redirect: rawRedirect, usePathname, useRouter, getPathname } = 
  createNavigation(routing); 

export async function redirect(href: string): Promise<never>;
export async function redirect(options: { href: string; locale?: string }): Promise<never>;
export async function redirect(hrefOrOptions: string | { href: string; locale?: string }): Promise<never> {
  if (typeof hrefOrOptions === 'string') {
    const locale = await getLocale();
    return rawRedirect({ href: hrefOrOptions, locale }) as never;
  } else {
    const locale = hrefOrOptions.locale || await getLocale();
    return rawRedirect({ href: hrefOrOptions.href, locale }) as never;
  }
}
