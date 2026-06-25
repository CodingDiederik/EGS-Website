import type { Metadata } from 'next';
import { Merriweather, Merriweather_Sans } from 'next/font/google';
import './globals.css';
import Footer from '@/components/Footer/Footer';
import Header from '@/components/Header/Header';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import {
  DEFAULT_OG_IMAGE,
  DEFAULT_TITLE,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from '@/lib/siteConfig';

const merriweather = Merriweather({
  variable: '--font-merriweather',
  subsets: ['latin'],
  weight: ['300', '400', '700'],
});

const merriweatherSans = Merriweather_Sans({
  variable: '--font-merriweather-sans',
  subsets: ['latin'],
  weight: ['300', '400', '700'],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: {
    type: 'website',
    locale: 'nl_NL',
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: SITE_DESCRIPTION,
    url: '/',
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: DEFAULT_TITLE,
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE.url],
  },
  verification: {
    google: 'DV05pC3PPYEZlCWyMAFsLEukuhVLg216Ag27O0mR4OE',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body
        className={`${merriweather.variable} ${merriweatherSans.variable} antialiased`}
      >
        <Header />
        <main>{children}</main>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
