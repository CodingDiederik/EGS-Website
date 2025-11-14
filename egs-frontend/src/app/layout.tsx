import type { Metadata } from 'next';
import { Merriweather, Merriweather_Sans } from 'next/font/google';
import './globals.css';
import HeaderSwitcher from '../components/Header/HeaderSwitcher';
import Footer from '@/components/Footer/Footer';

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
  description: 'Copyright EGS 2025',
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
        <HeaderSwitcher />
        {children}
        <Footer />
      </body>
    </html>
  );
}
