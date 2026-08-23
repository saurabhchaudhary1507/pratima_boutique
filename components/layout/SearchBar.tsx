'use client';

import { useState, useRef, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      setError('Please enter a search term');
      inputRef.current?.focus();
      return;
    }
    if (trimmed.length > 200) {
      setError('Search term must be 200 characters or fewer');
      return;
    }
    setError('');
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className="flex items-center gap-2"
      aria-label="Search products"
    >
      <div className="relative">
        <label htmlFor="site-search" className="sr-only">
          Search products
        </label>
        <input
          ref={inputRef}
          id="site-search"
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (error) setError('');
          }}
          placeholder="Search…"
          maxLength={201}
          className="w-40 sm:w-56 rounded-full border border-cream-300 bg-white px-4 py-1.5 text-sm text-brand-text-primary placeholder-brand-text-light focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 transition-all duration-200"
          aria-describedby={error ? 'search-error' : undefined}
          aria-invalid={!!error}
        />
        {error && (
          <p
            id="search-error"
            role="alert"
            className="absolute top-full left-0 mt-1 text-xs text-red-600 whitespace-nowrap"
          >
            {error}
          </p>
        )}
      </div>
      <button
        type="submit"
        className="rounded-full bg-brand-primary px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-secondary transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
        aria-label="Submit search"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>
    </form>
  );
}
