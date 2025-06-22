import { LandingPage } from "./components/landing-page"
import { setRequestLocale } from 'next-intl/server';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function Home({ params }: PageProps) {
  const { locale } = await params;
  
  // Enable static rendering
  setRequestLocale(locale);

  return <LandingPage />
}
