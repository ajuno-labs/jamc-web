import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

export const { Link, redirect: rawRedirect, usePathname, useRouter, getPathname } = 
  createNavigation(routing); 

export const redirect: (...args: Parameters<typeof rawRedirect>) => never =
  rawRedirect as unknown as (...args: Parameters<typeof rawRedirect>) => never;

