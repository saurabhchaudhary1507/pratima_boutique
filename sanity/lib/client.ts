import { createClient } from 'next-sanity';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;
const apiVersion = '2024-01-01';

/**
 * Server-side read client — uses SANITY_API_READ_TOKEN for authenticated reads.
 * Supports cache tags via `next.tags` for ISR revalidation.
 * Never expose this client or its token to the browser.
 */
export const serverClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_READ_TOKEN,
  stega: {
    enabled: false,
  },
});

/**
 * Public client — no token, safe for client-side / preview use.
 * Uses the Sanity CDN for fast, cached reads.
 */
export const publicClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  stega: {
    enabled: false,
  },
});

/**
 * Default export is the server-side read client, used in Server Components
 * and API routes where GROQ queries need cache-tag support.
 */
export const client = serverClient;

// ---------------------------------------------------------------------------
// Image URL builder
// ---------------------------------------------------------------------------

const builder = imageUrlBuilder(publicClient);

/**
 * Returns an image URL builder for a given Sanity image source.
 *
 * @example
 * urlFor(product.images[0]).width(800).auto('format').url()
 */
export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
