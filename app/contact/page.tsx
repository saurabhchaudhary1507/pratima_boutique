import Image from 'next/image';
import type { Metadata } from 'next';
import { ContactForm } from '@/components/contact/ContactForm';
import { getSiteSettings } from '@/sanity/lib/fetch';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Visit Pratima Boutique in Dasharabagh, Barabanki or get in touch with our team.',
};

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const ownerImage = settings?.ownerImage;

  return (
    <div className="mx-auto max-w-screen-xl px-6 py-12 sm:px-10 lg:px-16 lg:py-16">
      <header className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-secondary">Pratima Boutique</p>
        <h1 className="mt-2 text-display-md text-brand-text-primary">Contact Us</h1>
        <p className="mt-4 leading-7 text-brand-text-secondary">We would love to help you find something beautiful. Visit us in store or send us a message before your visit.</p>
      </header>

      <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <section className="space-y-8" aria-labelledby="visit-heading">
          <div>
            <h2 id="visit-heading" className="font-serif text-2xl font-semibold text-brand-text-primary">Visit us</h2>
            <address className="mt-4 not-italic leading-7 text-brand-text-secondary">
              Near Sagar Test House<br />
              Dasharabagh, Barabanki<br />
              Uttar Pradesh
            </address>
          </div>
          <div>
            <h2 className="font-serif text-2xl font-semibold text-brand-text-primary">Opening hours</h2>
            <p className="mt-4 text-brand-text-secondary">Monday–Sunday: 10:00–20:00</p>
          </div>
          <div>
            <h2 className="font-serif text-2xl font-semibold text-brand-text-primary">Get in touch</h2>
            <div className="mt-4 space-y-2 text-brand-text-secondary">
              <p><a className="font-semibold text-brand-primary hover:text-rose-700" href="tel:+919918266419">+91 9918266419</a></p>
              <p><a className="font-semibold text-brand-primary hover:text-rose-700" href="tel:+919956528448">+91 9956528448</a></p>
              <p><a className="font-semibold text-brand-primary hover:text-rose-700" href="https://wa.me/919918266419" target="_blank" rel="noreferrer">WhatsApp us</a></p>
            </div>
          </div>
          <div className="overflow-hidden rounded-lg border border-cream-300 bg-cream-100">
            {ownerImage?.asset.url ? (
              <Image src={ownerImage.asset.url} alt={ownerImage.altText || 'Owner of Pratima Boutique'} width={640} height={760} className="aspect-[4/5] w-full object-cover" />
            ) : (
              <div className="flex aspect-[4/5] items-center justify-center p-8 text-center text-sm text-brand-text-secondary">Owner photo coming soon</div>
            )}
          </div>
        </section>

        <section className="rounded-lg border border-cream-300 bg-white p-6 shadow-card sm:p-8" aria-labelledby="message-heading">
          <h2 id="message-heading" className="font-serif text-2xl font-semibold text-brand-text-primary">Send a message</h2>
          <p className="mt-2 mb-6 text-sm leading-6 text-brand-text-secondary">Complete the form and it will open a WhatsApp message addressed to our team.</p>
          <ContactForm />
        </section>
      </div>
    </div>
  );
}