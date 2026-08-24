import Link from 'next/link';
import { SearchBar } from './SearchBar';
import { SelectionListBadge } from './SelectionListBadge';
import { HamburgerMenu } from './HamburgerMenu';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/catalogue', label: 'Catalogue' },
  { href: '/contact', label: 'Contact' },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-cream-200 shadow-sm" role="banner">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 rounded"
            aria-label="Pratima Boutique — Home"
          >
            <span className="font-serif text-xl font-bold text-brand-primary tracking-wide">
              Pratima
            </span>
            <span className="font-serif text-xl font-light text-brand-text-secondary">
              Boutique
            </span>
            <span
              aria-hidden="true"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-brand-text-primary font-serif text-[10px] font-bold tracking-[-0.08em] text-brand-text-primary"
            >
              PB
            </span>
          </Link>

          {/* Desktop nav */}
          <nav
            aria-label="Main navigation"
            className="hidden md:flex items-center gap-6"
          >
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm font-medium text-brand-text-primary hover:text-brand-primary transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 rounded px-1 py-0.5"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Right side: search + selection list + hamburger */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <SearchBar />
            </div>
            <SelectionListBadge />
            {/* Hamburger — mobile only */}
            <div className="md:hidden">
              <HamburgerMenu navLinks={navLinks} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
