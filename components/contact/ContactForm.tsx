'use client';

import type { FormEvent, useState } from 'react';

const whatsappNumber = '919918266419';

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const message = [
      `Hello Pratima Boutique, my name is ${formData.get('name')}.`,
      `Phone: ${formData.get('phone')}`,
      `Message: ${formData.get('message')}`,
    ].join('\n');

    setSubmitted(true);
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" aria-label="Send us a WhatsApp message">
      <div>
        <label htmlFor="contact-name" className="block text-sm font-semibold text-brand-text-primary">Name</label>
        <input id="contact-name" name="name" required autoComplete="name" className="mt-2 w-full rounded border border-cream-300 bg-white px-4 py-3 text-sm focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20" />
      </div>
      <div>
        <label htmlFor="contact-phone" className="block text-sm font-semibold text-brand-text-primary">Phone number</label>
        <input id="contact-phone" name="phone" required type="tel" autoComplete="tel" className="mt-2 w-full rounded border border-cream-300 bg-white px-4 py-3 text-sm focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20" />
      </div>
      <div>
        <label htmlFor="contact-message" className="block text-sm font-semibold text-brand-text-primary">How can we help?</label>
        <textarea id="contact-message" name="message" required rows={5} className="mt-2 w-full rounded border border-cream-300 bg-white px-4 py-3 text-sm focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20" />
      </div>
      {submitted && <p role="status" className="text-sm text-brand-secondary">Your message is ready in WhatsApp. Send it there and we will get back to you soon.</p>}
      <button type="submit" className="rounded bg-brand-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2">Message us on WhatsApp</button>
    </form>
  );
}