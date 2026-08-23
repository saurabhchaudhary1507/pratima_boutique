import type { Metadata } from 'next';
import { Playfair_Display, Raleway } from 'next/font/google';
import './globals.css';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const raleway = Raleway({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    template: '%s | Pratima Boutique',
    default: 'Pratima Boutique — Ladies Wear',
  },
  description: 'Discover elegant ladies wear at Pratima Boutique. Browse our curated collections and plan your in-store visit.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfairDisplay.variable} ${raleway.variable}`}>
      <body className="bg-ivory-100 text-brand-text-primary font-sans antialiased min-h-screen flex flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:bg-brand-primary focus:text-white focus:rounded focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-primary"
        >
          Skip to main content
        </a>
        <SiteHeader />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
