interface ProductCountBadgeProps {
  count: number;
  label?: string;
}

export function ProductCountBadge({ count, label = 'products' }: ProductCountBadgeProps) {
  return (
    <p className="text-sm text-brand-text-secondary" aria-live="polite" aria-atomic="true">
      Showing{' '}
      <span className="font-semibold text-brand-text-primary">{count}</span>{' '}
      {count === 1 ? label.replace(/s$/, '') : label}
    </p>
  );
}
