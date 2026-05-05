import type { Metadata } from 'next';
import { Merriweather, Merriweather_Sans } from 'next/font/google';
import './globals.css';
import Footer from '@/components/Footer/Footer';
import Header from '@/components/Header/Header';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

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
  title: 'EGS website',
  description:
    'Copyright Eerste Goirlese Schaakclub ' + new Date().getFullYear(),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <head>
        <meta
          name="google-site-verification"
          content="DV05pC3PPYEZlCWyMAFsLEukuhVLg216Ag27O0mR4OE"
        />
      </head>
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
