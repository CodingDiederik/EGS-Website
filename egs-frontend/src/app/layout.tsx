import type { Metadata } from 'next';
import { Merriweather, Merriweather_Sans } from 'next/font/google';
import Header from './components/Header';
import './globals.css';

const merriweather = Merriweather({
  variable: '--font-merriweather',
  subsets: ['latin'],
});

const merriweatherSans = Merriweather_Sans({
  variable: '--font-merriweather-sans',
  subsets: ['latin'],
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
    <html lang="en">
      <body
        className={`${merriweather.variable} ${merriweatherSans.variable} antialiased`}
      >
        <Header />
        {children}
      </body>
    </html>
  );
}
