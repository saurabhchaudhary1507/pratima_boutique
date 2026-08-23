'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import FocusTrap from 'focus-trap-react';

interface NavLink {
  href: string;
  label: string;
}

interface HamburgerMenuProps {
  navLinks: NavLink[];
}

export function HamburgerMenu({ navLinks }: HamburgerMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuId = 'mobile-nav-menu';

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Prevent body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* Hamburger button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={menuId}
        aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
        className="inline-flex items-center justify-center p-2 rounded-md text-brand-text-primary hover:text-brand-primary hover:bg-cream-100 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
      >
        <span className="sr-only">{isOpen ? 'Close menu' : 'Open menu'}</span>
        {isOpen ? (
          /* X icon */
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          /* Hamburger icon */
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          aria-hidden="true"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Slide-in drawer */}
      <FocusTrap active={isOpen} focusTrapOptions={{ allowOutsideClick: true }}>
        <div
          id={menuId}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          className={`fixed top-0 right-0 z-50 h-full w-72 max-w-full bg-white shadow-modal transform transition-transform duration-350 ease-out ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between px-6 py-5 border-b border-cream-200">
            <span className="font-serif text-lg font-bold text-brand-primary">Menu</span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close navigation menu"
              className="p-2 rounded-md text-brand-text-secondary hover:text-brand-primary hover:bg-cream-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav aria-label="Mobile navigation" className="px-6 py-6">
            <ul className="space-y-1">
              {navLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => setIsOpen(false)}
                    className="block py-3 px-2 text-base font-medium text-brand-text-primary hover:text-brand-primary hover:bg-cream-50 rounded-md transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
                  >
                    {label}
                  </Link>
                </li>
              ))}
              <li className="pt-2 border-t border-cream-200 mt-2">
                <Link
                  href="/selection-list"
                  onClick={() => setIsOpen(false)}
                  className="block py-3 px-2 text-base font-medium text-brand-primary hover:bg-cream-50 rounded-md transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
                >
                  ♥ Selection List
                </Link>
              </li>
            </ul>
          </nav>

          {/* Mobile search */}
          <div className="px-6 pb-6">
            <form
              role="search"
              action="/search"
              method="get"
              aria-label="Search products"
            >
              <label htmlFor="mobile-search" className="sr-only">Search products</label>
              <div className="flex gap-2">
                <input
                  id="mobile-search"
                  type="search"
                  name="q"
                  placeholder="Search products…"
                  maxLength={201}
                  className="flex-1 rounded-full border border-cream-300 bg-white px-4 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
                />
                <button
                  type="submit"
                  className="rounded-full bg-brand-primary px-3 py-2 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
                  aria-label="Submit search"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      </FocusTrap>
    </>
  );
}
