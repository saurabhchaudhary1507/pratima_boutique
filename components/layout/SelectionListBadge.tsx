'use client';

import Link from 'next/link';
import { useSelectionList } from '@/store/selectionList';

export function SelectionListBadge() {
  const items = useSelectionList((state) => state.items);
  const count = items.length;

  return (
    <Link
      href="/selection-list"
      className="relative inline-flex items-center gap-1.5 text-sm font-medium text-brand-text-primary hover:text-brand-primary transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 rounded px-2 py-1"
      aria-label={`Selection list${count > 0 ? `, ${count} item${count !== 1 ? 's' : ''}` : ', empty'}`}
    >
      {/* Heart/list icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      <span className="hidden sm:inline">List</span>
      {count > 0 && (
        <span
          className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-primary text-white text-[10px] font-bold"
          aria-hidden="true"
        >
          {count > 9 ? '9+' : count}
        </span>
      )}
    </Link>
  );
}
