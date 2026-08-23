import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="bg-ivory-200 border-t border-cream-200 mt-auto" role="contentinfo">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h2 className="font-serif text-xl text-brand-primary mb-2">Pratima Boutique</h2>
            <p className="text-sm text-brand-text-secondary italic">
              Elegance in every thread.
            </p>
          </div>

          {/* Navigation */}
          <nav aria-label="Footer navigation">
            <h3 className="text-sm font-semibold text-brand-text-primary uppercase tracking-wide mb-3">
              Explore
            </h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: '/catalogue', label: 'Catalogue' },
                { href: '/collections', label: 'Collections' },
                { href: '/contact', label: 'Contact Us' },
                { href: '/selection-list', label: 'Selection List' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-brand-text-secondary hover:text-brand-primary transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 rounded"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold text-brand-text-primary uppercase tracking-wide mb-3">
              Visit Us
            </h3>
            <address className="not-italic text-sm text-brand-text-secondary space-y-1">
              <p>Near Sagar Test House</p>
              <p>Dasharabagh, Barabanki</p>
              <p className="mt-2">
                <a
                  href="tel:+919918266419"
                  className="hover:text-brand-primary transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 rounded"
                >
                  +91 9918266419, +91 9956528448
                </a>
              </p>
              <p className="mt-2 text-xs">Mon–Sun: 10:00–20:00</p>
            </address>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-cream-300 text-center text-xs text-brand-text-light">
          <p>© {new Date().getFullYear()} Pratima Boutique. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
