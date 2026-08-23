import Link from 'next/link';

interface EmptyStateProps {
  title: string;
  message: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export function EmptyState({ title, message, ctaLabel, ctaHref }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="text-6xl mb-4" aria-hidden="true">🌸</div>
      <h2 className="font-serif text-2xl font-medium text-brand-text-primary mb-2">{title}</h2>
      <p className="text-brand-text-secondary max-w-sm mb-6">{message}</p>
      {ctaLabel && ctaHref && (
        <Link
          href={ctaHref}
          className="inline-block bg-brand-primary text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-brand-secondary transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
        >
          {ctaLabel}
        </Link>
      )}
    </div>
  );
}
