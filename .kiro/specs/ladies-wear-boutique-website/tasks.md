# Implementation Plan: Pratima Boutique — Ladies Wear Showcase Website

## Overview

Implement the full ladies wear boutique showcase website using Next.js 14 (App Router), TypeScript, Tailwind CSS, Sanity CMS, Zustand, and Resend. The implementation proceeds in phases: project scaffolding → CMS schemas and data layer → layout components → page-by-page features → selection list → search → contact → SEO → accessibility polish → testing → Sanity Studio.

---

## Tasks

- [ ] 1. Project scaffolding and configuration
  - [x] 1.1 Bootstrap Next.js 14 App Router project with TypeScript and Tailwind CSS
    - Run `create-next-app` with `--typescript`, `--tailwind`, `--app` flags
    - Confirm `tsconfig.json` strict mode is on; configure `tailwind.config.ts` with the project's custom colour palette and `fontFamily` tokens (feminine/elegant brand)
    - Add `prettier` and `eslint` configs; add `@typescript-eslint` rules
    - _Requirements: 7.1, 9.6_

  - [-] 1.2 Install and configure Sanity v3 with `next-sanity`
    - Install `sanity`, `next-sanity`, `@sanity/image-url`
    - Create `sanity.config.ts` at project root with `projectId`, `dataset`, and `plugins: [structureTool(), visionTool()]`
    - Create `sanity/lib/client.ts` exporting a server-side read client (using `SANITY_API_READ_TOKEN`) and a public preview client
    - _Requirements: 8.1–8.6_

  - [-] 1.3 Install and configure Zustand and Resend
    - Install `zustand`, `resend`, `react-email`
    - Install `zod` for form/API validation
    - Install `focus-trap-react` for hamburger menu accessibility
    - Install `vitest`, `@vitest/coverage-v8`, `fast-check`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`
    - Configure `vitest.config.ts` with jsdom environment and path aliases matching `tsconfig.json`
    - _Requirements: 5.1–5.10, 10.4–10.6_

  - [-] 1.4 Configure `next.config.ts` for image optimisation and security headers
    - Set `images.formats: ['image/avif', 'image/webp']` for WebP/AVIF serving (Req 9.3)
    - Add Sanity CDN (`cdn.sanity.io`) and Google Maps static to `images.remotePatterns`
    - Add `X-Frame-Options`, `X-Content-Type-Options`, and `Referrer-Policy` security headers
    - _Requirements: 9.3_

  - [x] 1.5 Set up environment variable schema and `.env.local.example`
    - Define required env vars: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_API_READ_TOKEN`, `SANITY_WEBHOOK_SECRET`, `RESEND_API_KEY`, `BOUTIQUE_EMAIL`, `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL`
    - Create `.env.local.example` with placeholder values and inline comments
    - _Requirements: 10.4_

- [x] 2. Sanity CMS schema definitions
  - [x] 2.1 Create `sanity/schemas/category.ts` schema
    - Fields: `name` (string, required), `slug` (slug, required, auto-generated from name, pattern `^[a-z0-9]+(-[a-z0-9]+)*$`)
    - Export and register in `sanity/schemas/index.ts`
    - _Requirements: 8.5, 9.5_

  - [x] 2.2 Create `sanity/schemas/product.ts` schema
    - Fields: `name` (string, required), `slug` (slug, required), `description` (array of blocks / portable text, required), `price` (number, required), `originalPrice` (number, optional), `images` (array of image with `altText` string field, min 1 max 10, required), `categories` (array of references to category, required), `collections` (array of references to collection, optional), `variants` (array of object `{size, colour, inStock}`, required, min 1), `isActive` (boolean, default true, required)
    - Add custom validation: name + price + at least one variant required before saving (Req 8.1, 8.6)
    - _Requirements: 8.1, 8.5, 8.6, 9.5_

  - [x] 2.3 Create `sanity/schemas/collection.ts` schema
    - Fields: `name` (string, required), `slug` (slug, required), `description` (string, required), `coverImage` (image with `altText`, required), `products` (array of references to product), `isActive` (boolean, default true)
    - _Requirements: 8.2, 6.1–6.5_

  - [x] 2.4 Create `sanity/schemas/heroBanner.ts` schema
    - Fields: `image` (image, required), `altText` (string, required), `headline` (string, required), `subheadline` (string, optional), `ctaLabel` (string, optional), `ctaLink` (string, optional), `isActive` (boolean, default false)
    - _Requirements: 8.3, 1.1, 1.3_

  - [x] 2.5 Create `sanity/schemas/siteSettings.ts` singleton schema
    - Fields: `featuredCollections` (array of references to collection, max 3), `metaTitle` (string, max 60 chars), `metaDescription` (string, max 160 chars)
    - Register as singleton in `sanity.config.ts` structure plugin
    - _Requirements: 8.3, 9.1_

- [x] 3. TypeScript data model types and GROQ queries
  - [x] 3.1 Create `types/index.ts` with all shared TypeScript interfaces
    - Define `ProductVariant`, `Product`, `Category`, `Collection`, `HeroBanner`, `SiteSettings`, `SelectionListItem`, `SelectionListState`, `ContactFormPayload`, `FilterState` interfaces exactly as specified in the design document
    - Export all types from a single barrel file
    - _Requirements: 2.1, 3.1, 5.1–5.6, 10.4_

  - [x] 3.2 Create all GROQ query constants in `sanity/lib/queries.ts`
    - `NEW_ARRIVALS_QUERY`: active products within last 30 days, ordered `_createdAt desc`, limit 8; fallback to 8 most recent if window is empty (Req 1.2, 1.6)
    - `CATALOGUE_QUERY`: all active products, optional category/colour/size filter params, configurable sort order (Req 2.1–2.5)
    - `PRODUCT_BY_SLUG_QUERY`: full product detail including images metadata, categories, collections (Req 3.1)
    - `RELATED_PRODUCTS_QUERY`: same collection first, then same category, exclude self, limit 6 (Req 3.8)
    - `COLLECTIONS_INDEX_QUERY`: all active collections with cover image and name (Req 6.1)
    - `COLLECTION_BY_SLUG_QUERY`: single active collection with products (Req 6.2–6.3)
    - `SEARCH_QUERY`: match operator on name, description, category name; no cache (Req 4.2)
    - `HERO_BANNER_QUERY`: single active banner (Req 1.1)
    - `SITE_SETTINGS_QUERY`: featured collections and meta fields (Req 8.3)
    - `ALL_PRODUCT_SLUGS_QUERY`, `ALL_COLLECTION_SLUGS_QUERY`, `ALL_CATEGORIES_QUERY` for sitemap (Req 9.2)
    - _Requirements: 1.2, 1.6, 2.1–2.5, 3.1, 3.8, 4.2, 6.1–6.3, 9.2_

  - [x] 3.3 Create `sanity/lib/fetch.ts` with all cached query functions
    - Implement `getNewArrivals`, `getCatalogueProducts`, `getProductBySlug`, `getRelatedProducts`, `getCollectionsIndex`, `getCollectionBySlug`, `searchProducts`, `getActiveBanner`, `getSiteSettings`, `getAllProductSlugs`, `getAllCollectionSlugs`, `getAllCategories` as `cache(async ...)` wrappers with appropriate `next.tags` (Req 1.3, 8.4)
    - `searchProducts` must NOT use cache (always fresh, Req 4.2)
    - Add `generateSlug(name: string): string` utility in `lib/utils/slug.ts` enforcing pattern `^[a-z0-9]+(-[a-z0-9]+)*$`
    - Add `isNewArrival(product: Product, referenceDate?: Date): boolean` utility in `lib/utils/newArrivals.ts`
    - _Requirements: 1.2, 1.3, 4.2, 8.4, 9.2, 9.5_

  - [ ]* 3.4 Write property tests for data utility functions
    - **Property 1: New Arrivals Window and Order** — `isNewArrival` returns products within 30 days, ordered desc, max 8
    - **Property 7: New Badge Correctness** — `isNewArrival(product, ref)` true iff `_createdAt` within 30 days of `ref`
    - **Property 20: Slug Format Invariant** — `generateSlug(name)` always produces `^[a-z0-9]+(-[a-z0-9]+)*$`
    - Test file: `__tests__/property/newArrivals.property.test.ts`, `__tests__/property/seo.property.test.ts`
    - **Validates: Requirements 1.2, 2.6, 9.5**

- [x] 4. Root layout, SiteHeader, and SiteFooter
  - [x] 4.1 Create `app/layout.tsx` root layout with global providers
    - Import and render `SiteHeader` and `SiteFooter`
    - Wrap children with `SelectionListProvider` (Zustand store initialisation)
    - Add skip-to-content link (`<a href="#main-content">`) at top of body (Req 7.3)
    - Set `lang="en"` on `<html>` tag; apply global Tailwind base styles and Google Font import
    - _Requirements: 5.4, 7.3_

  - [x] 4.2 Create `components/layout/SiteFooter.tsx`
    - Display boutique address and phone number (from `SiteSettings` or static env config) (Req 10.3)
    - Include `FooterNav` with links to Catalogue, Collections, Contact, Selection List
    - Include brand tagline
    - Ensure all links are keyboard-navigable with visible focus indicators (Req 7.3)
    - _Requirements: 10.3, 7.3_

  - [x] 4.3 Create `components/layout/SiteHeader.tsx` with desktop navigation
    - Render Logo (placeholder SVG), `NavLinks` for desktop (links: Home, Catalogue, Collections, Contact), `SearchBar` (input + submit), `SelectionListBadge` (Zustand-driven count)
    - `NavLinks` hidden below 768 px; full nav visible at `md:` breakpoint and above (Req 7.5)
    - `SelectionListBadge` is a Client Component showing `items.length` from Zustand store (Req 5.4)
    - _Requirements: 4.1, 5.4, 7.5_

  - [x] 4.4 Create `components/layout/HamburgerMenu.tsx` mobile navigation
    - Visible only below 768 px; renders hamburger icon button with `aria-expanded` and `aria-controls`
    - Toggle `isOpen` state; renders full nav as a slide-in drawer overlay
    - Trap focus inside open drawer using `focus-trap-react` (Req 7.3)
    - Close on `Escape` key; close on outside click
    - Apply `aria-label="Open navigation menu"` / `"Close navigation menu"` dynamically (Req 7.3)
    - _Requirements: 7.3, 7.5_

- [x] 5. Shared UI components
  - [x] 5.1 Create `components/ui/ProductCard.tsx`
    - Display thumbnail (`next/image` with `loading="lazy"`, `placeholder="blur"`, explicit `width`/`height`, descriptive `alt`), product name, and formatted price
    - Show "New" badge when `isNewArrival` is true (Req 2.6)
    - Show "Sale" badge when `originalPrice > price` (Req 2.7)
    - Strike-through original price + contrasting current price when on sale (Req 3.4)
    - Entire card is a link to `/products/{slug}`; ensure accessible name on the link (Req 7.3)
    - _Requirements: 1.4, 1.5, 2.1, 2.6, 2.7, 3.4, 7.2, 7.3_

  - [ ]* 5.2 Write property tests for ProductCard
    - **Property 2: Product Card Renders Required Fields** — any product with name, thumbnail, price renders all three
    - **Property 7: New Badge Correctness** — badge appears iff `isNewArrival` true
    - **Property 8: Sale Badge and Price Display Correctness** — Sale badge + strikethrough iff `originalPrice > price`
    - Test file: `__tests__/property/product.property.test.ts`
    - **Validates: Requirements 1.4, 2.6, 2.7, 3.4**

  - [x] 5.3 Create `components/ui/ProductGrid.tsx` and `components/ui/ProductCountBadge.tsx`
    - `ProductGrid`: responsive CSS grid (1 col → `sm:` 2 col → `lg:` 3 col → `xl:` 4 col) rendering `ProductCard[]`
    - `ProductCountBadge`: displays "Showing N products" text; updates reactively (Req 2.4)
    - _Requirements: 2.4, 7.1_

  - [x] 5.4 Create `components/ui/EmptyState.tsx` and `components/ui/ConfirmationDialog.tsx`
    - `EmptyState`: configurable message + CTA link; used for empty catalogue filter, empty search, empty selection list
    - `ConfirmationDialog`: accessible modal with `role="dialog"`, `aria-modal="true"`, focus trap; used for Clear All (Req 5.7)
    - _Requirements: 2.8, 4.3, 5.7, 5.8_

- [ ] 6. Homepage
  - [ ] 6.1 Create `app/page.tsx` homepage (ISR, `revalidateTag('homepage')`)
    - Fetch active `HeroBanner`, `NewArrivals` (up to 8, last 30 days or 8 most recent if empty), and `featuredCollections` from Sanity using `getActiveBanner`, `getNewArrivals`, `getSiteSettings`
    - Tag the fetch with `{ next: { tags: ['homepage'] } }` (Req 1.3)
    - _Requirements: 1.1, 1.2, 1.3, 1.6_

  - [~] 6.2 Create `components/home/HeroBanner.tsx`
    - Full-bleed image using `next/image` with `priority` prop (above fold, no lazy load, Req 9.4)
    - Display headline, optional subheadline, optional CTA button linking to `ctaLink`
    - `alt` text sourced from CMS `altText` field (Req 7.2)
    - Responsive: full viewport height on desktop, proportional on mobile
    - _Requirements: 1.1, 7.2, 9.4_

  - [~] 6.3 Create `components/home/NewArrivalsSection.tsx` and `components/home/FeaturedCollectionSection.tsx`
    - `NewArrivalsSection`: renders heading + `ProductGrid` of up to 8 new arrival products; no "New" badge if falling back to 8 most recent (Req 1.6)
    - `FeaturedCollectionSection`: renders heading, collection name, and `ProductGrid` for each featured collection from `SiteSettings.featuredCollections`
    - _Requirements: 1.1, 1.2, 1.4, 1.5, 1.6_

- [ ] 7. Product Catalogue page
  - [~] 7.1 Create `app/catalogue/page.tsx` (ISR, `revalidateTag('catalogue')`)
    - Fetch all active products via `getCatalogueProducts`; accept `category`, `colour`, `size`, and `sort` URL search params
    - Pass filter/sort state down to `FilterSidebar` and `ProductGrid`
    - _Requirements: 2.1, 2.2, 2.3, 2.5, 2.8_

  - [~] 7.2 Create `components/catalogue/FilterSidebar.tsx`
    - Render category checkboxes (from all available categories), colour checkboxes, size checkboxes as Client Component
    - Update URL search params on filter change (pushState / Next.js `router.push`) — keeps filter state in URL (shareable)
    - "Clear all filters" link when any filter is active (Req 2.8)
    - All form controls have associated `<label>` elements (Req 7.3)
    - _Requirements: 2.2, 2.3, 2.8, 7.3_

  - [~] 7.3 Create `components/catalogue/SortSelector.tsx`
    - `<select>` with options: Newest First (default), Price: Low to High, Price: High to Low (Req 2.5)
    - Updates `sort` URL search param on change
    - Accessible `<label for="sort-select">` (Req 7.3)
    - _Requirements: 2.1, 2.5, 7.3_

  - [ ]* 7.4 Write property tests for catalogue filter and sort functions
    - **Property 3: Catalogue Excludes Deactivated Products** — no product with `isActive === false` in result
    - **Property 4: Category Filter Correctness** — all results belong to selected category and are active
    - **Property 5: Conjunctive Filter Correctness** — results satisfy all active filters simultaneously
    - **Property 6: Sort Order Invariants** — adjacent pairs satisfy price/date ordering predicate
    - Test file: `__tests__/property/catalogue.property.test.ts`
    - **Validates: Requirements 2.1, 2.2, 2.3, 2.5**

- [ ] 8. Product Detail page
  - [~] 8.1 Create `app/products/[slug]/page.tsx` with `generateStaticParams` and `generateMetadata`
    - Fetch product by slug; call `notFound()` if not found or `isActive === false`
    - `generateMetadata`: title `${product.name} | Pratima Boutique` (max 60 chars), description from `product.description` plain text (max 160 chars), OG image (Req 9.1)
    - Tag fetch with `{ next: { tags: ['product-${slug}'] } }` (Req 8.4)
    - _Requirements: 3.1, 9.1_

  - [~] 8.2 Create `components/product/ProductGallery.tsx` (Client Component)
    - Display current image with `next/image`; previous/next arrow buttons (Req 3.2, 3.3)
    - Keyboard navigable arrows; `aria-label="Previous image"` / `"Next image"` (Req 7.3)
    - First image uses `priority` prop (above fold); remaining images `loading="lazy"`
    - Thumbnail strip for quick image selection
    - `alt` text: `${product.name} — image ${n}` (Req 7.2)
    - _Requirements: 3.1, 3.2, 3.3, 7.2, 7.3, 9.4_

  - [~] 8.3 Create `components/product/VariantSelector.tsx` (Client Component)
    - Render size and colour selector buttons (Req 3.1)
    - Visually and accessibly mark out-of-stock variants with "Out of Stock" label; meet WCAG 4.5:1 contrast (Req 3.5, 7.4)
    - Track `selectedSize` and `selectedColour` in local state; expose via callback to parent
    - _Requirements: 3.1, 3.5, 7.4_

  - [~] 8.4 Create `components/product/AddToSelectionListButton.tsx` (Client Component)
    - Disabled state with inline prompt when variant unselected (both size and colour options exist) (Req 5.10, 3.6)
    - On click with out-of-stock variant: display unavailability message; do NOT add to list (Req 3.7)
    - On click with in-stock variant: call Zustand `addItem`; display visual confirmation for ≥2 s (Req 5.1)
    - If duplicate: display "already in your selection list" message (Req 5.2)
    - Button meets WCAG 4.5:1 contrast (Req 3.6, 7.4)
    - _Requirements: 3.6, 3.7, 5.1, 5.2, 5.10, 7.4_

  - [~] 8.5 Create `components/product/RelatedProducts.tsx`
    - Fetch related products via `getRelatedProducts(productId, collectionId, categoryId)` (Req 3.8)
    - Display 1–6 `ProductCard` components; collection-same products listed before category-fallback
    - _Requirements: 3.8_

  - [~] 8.6 Assemble full `ProductDetailPage` layout in `app/products/[slug]/page.tsx`
    - Compose `ProductGallery`, `ProductInfo` (name, `PriceDisplay`, `VariantSelector`, `AddToSelectionListButton`), `RelatedProducts`
    - `PriceDisplay`: struck-through original + contrasting current price when `originalPrice > price` (Req 3.4)
    - _Requirements: 3.1, 3.4, 3.5, 3.6, 3.7, 3.8_

  - [ ]* 8.7 Write property tests for Product Detail logic
    - **Property 8: Sale Badge and Price Display Correctness** — strikethrough + sale badge iff `originalPrice > price`
    - **Property 9: Out-of-Stock Variant Guard** — list unchanged + message displayed when OOS variant selected and add triggered
    - **Property 10: Related Products Priority Invariant** — collection-first ordering, count 1–6
    - Test file: `__tests__/property/product.property.test.ts`
    - **Validates: Requirements 2.7, 3.4, 3.5, 3.7, 3.8**

- [ ] 9. Collections pages
  - [~] 9.1 Create `app/collections/page.tsx` — collections index (ISR, `revalidateTag('collections')`)
    - Fetch all active collections via `getCollectionsIndex`; tag with `{ next: { tags: ['collections'] } }`
    - Render a grid of collection cards: cover image (`next/image`, `loading="lazy"`), collection name, link to `/collections/{slug}`
    - `generateMetadata`: title "Collections | Pratima Boutique" (Req 9.1)
    - _Requirements: 6.1, 6.4, 9.1_

  - [~] 9.2 Create `app/collections/[slug]/page.tsx` — single collection page with `generateStaticParams` and `generateMetadata`
    - Fetch collection by slug; call `notFound()` if not found or inactive
    - Render `CollectionHeader` (cover image with `priority`, name, description) + `ProductGrid` (Req 6.2, 6.3)
    - If no active products: display "No products currently available in this collection" message (Req 6.5)
    - Tag fetch with `{ next: { tags: ['collection-${slug}'] } }` (Req 6.4)
    - `generateMetadata`: title `${collection.name} | Pratima Boutique` (max 60 chars), description (max 160 chars) (Req 9.1)
    - _Requirements: 6.2, 6.3, 6.4, 6.5, 9.1_

- [ ] 10. Selection List (Zustand store and page)
  - [~] 10.1 Create `store/selectionList.ts` Zustand store with persist middleware
    - Implement `useSelectionList` store exactly as specified in design: `items`, `addItem`, `removeItem`, `clearAll`, `hasItem`
    - Deduplication key: `productId + selectedSize + selectedColour` (Req 5.2)
    - `persist` middleware with key `'pratima-selection-list'` writing to `localStorage` (Req 5.6)
    - Wrap `localStorage` access in `try/catch`; degrade to in-memory with UI notice on failure (Req design error handling)
    - _Requirements: 5.1, 5.2, 5.4, 5.5, 5.6, 5.7_

  - [ ]* 10.2 Write property tests for the Zustand Selection List store
    - **Property 13: Selection List Add — Round Trip Persistence** — item survives serialise/deserialise cycle intact
    - **Property 14: Selection List Duplicate Guard** — `addItem` with existing key leaves list unchanged (same length, same contents)
    - **Property 15: Selection List Count Invariant** — count equals `items.length` after every mutation
    - **Property 16: Selection List Remove Correctness** — after `removeItem`, item absent and length is exactly one less
    - Test file: `__tests__/property/selectionList.property.test.ts`
    - **Validates: Requirements 5.1, 5.2, 5.4, 5.5, 5.6**

  - [~] 10.3 Create `app/selection-list/page.tsx` (Client Component, CSR)
    - Render `InStoreNote` prominently at top (Req 5.9)
    - Render `SelectionListItem[]` showing thumbnail, name, selected size, selected colour, price, and remove button (Req 5.3)
    - Remove button: call `removeItem`; update list immediately (Req 5.5)
    - `ClearAllButton`: open `ConfirmationDialog`; on confirm call `clearAll` (Req 5.7)
    - `EmptyState` with link to Catalogue when `items.length === 0` (Req 5.8)
    - On mount: fetch current product status for each item from Sanity and silently remove stale (deactivated) items; display banner if any removed (Req 8.4)
    - _Requirements: 5.3, 5.5, 5.7, 5.8, 5.9, 8.4_

  - [ ]* 10.4 Write property tests for Selection List UI and button state
    - **Property 17: Add Button Disabled When Variant Unselected** — button in disabled state with prompt when size/colour unselected
    - Test file: `__tests__/property/selectionList.property.test.ts`
    - **Validates: Requirements 5.10**

- [ ] 11. Search functionality
  - [~] 11.1 Create `app/search/page.tsx` search results page (no cache, always SSR)
    - Accept `q` URL search param; validate: empty or >200 chars → display validation message, maintain page state (Req 4.4)
    - Call `searchProducts(term)` for valid terms; render `ProductGrid` of results (Req 4.2)
    - Show "No results found" + link to Catalogue when results empty (Req 4.3)
    - Show result count via `ProductCountBadge` (Req 2.4)
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [~] 11.2 Wire `SearchBar` in `SiteHeader` to submit search term to `/search?q={term}`
    - `SearchBar` Client Component: controlled input; on submit navigate to `/search?q=...` using `router.push`
    - Validate client-side: empty → show inline error; >200 chars → show inline error (Req 4.4)
    - Accessible: `role="search"`, `<label>` or `aria-label` on input, submit button with accessible name (Req 7.3)
    - _Requirements: 4.1, 4.4, 7.3_

  - [ ]* 11.3 Write property tests for search logic
    - **Property 11: Search Returns Exactly Matching Products** — result contains exactly active products with name/description/category matching search term (case-insensitive substring)
    - **Property 12: Search Input Validation** — empty or >200-char input returns error, no GROQ query issued
    - Test file: `__tests__/property/search.property.test.ts`
    - **Validates: Requirements 4.2, 4.4**

- [ ] 12. Contact / Visit Us page
  - [~] 12.1 Create `app/contact/page.tsx` (static, no dynamic data)
    - Display `ContactDetails` section: physical address, phone, business hours in `"Day–Day: HH:MM–HH:MM"` format (Req 10.1)
    - Embed Google Maps iframe via `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL` env var (Req 10.2)
    - Render `ContactForm` component (Req 10.4)
    - `generateMetadata`: title "Contact Us | Pratima Boutique" (Req 9.1)
    - _Requirements: 10.1, 10.2, 10.4, 9.1_

  - [~] 12.2 Create `app/contact/actions.ts` Server Action for contact form email
    - Validate payload with `zod` schema (name min 1, email valid format, message min 1)
    - On invalid: return `{ success: false, errors: fieldErrors }` (Req 10.5)
    - On valid: send via `Resend.emails.send`; on Resend error return `{ success: false, sendError: true }` (Req 10.6)
    - On success: return `{ success: true }` (Req 10.4)
    - Never log or expose `RESEND_API_KEY` or `BOUTIQUE_EMAIL` in client responses
    - _Requirements: 10.4, 10.5, 10.6_

  - [~] 12.3 Create `components/contact/ContactForm.tsx` (Client Component)
    - Fields: name, email, message — all required; associated `<label>` for each (Req 7.3)
    - Client-side validation on blur (UX); server-side validation via Server Action (correctness)
    - On `success: true`: show confirmation banner for ≥2 s, reset form (Req 10.4)
    - On `errors`: highlight missing fields with accessible error messages (`role="alert"`), retain filled values (Req 10.5)
    - On `sendError: true`: show "submission could not be completed" error, retain all form data (Req 10.6)
    - _Requirements: 10.4, 10.5, 10.6, 7.3_

  - [ ]* 12.4 Write property tests for contact form validation
    - **Property 21: Contact Form Validation — Missing Fields** — any subset of required fields empty returns error naming every empty field and preserving non-empty values
    - **Property 22: Product Image Alt Text** — every `<Image>` for a product has non-empty `alt`
    - Test file: `__tests__/property/contactForm.property.test.ts`
    - **Validates: Requirements 10.5, 7.2**

- [~] 13. Checkpoint — Core pages complete
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 14. SEO — metadata, sitemap, and slug utilities
  - [~] 14.1 Add `generateMetadata` to all remaining pages without it
    - `app/catalogue/page.tsx`: title "Shop All | Pratima Boutique", description max 160 chars (Req 9.1)
    - `app/search/page.tsx`: title `Search: "${q}" | Pratima Boutique` (Req 9.1)
    - `app/selection-list/page.tsx`: title "Your Selection List | Pratima Boutique" (Req 9.1)
    - All titles max 60 chars, all descriptions max 160 chars, all non-empty (Req 9.1)
    - _Requirements: 9.1_

  - [~] 14.2 Create `app/sitemap.ts` dynamic sitemap
    - Fetch all active product slugs, collection slugs, and categories from Sanity
    - Return `MetadataRoute.Sitemap` array including: homepage (priority 1.0), catalogue (0.9), collections index (0.8), contact (0.5), all product pages (0.7), all collection pages (0.6)
    - _Requirements: 9.2_

  - [ ]* 14.3 Write property tests for SEO metadata and sitemap
    - **Property 18: SEO Metadata Character Limits** — `generateMetadata` produces title ≤60 chars and description ≤160 chars, both non-empty, for any product/collection/category
    - **Property 19: Sitemap Completeness** — every active product page and collection page has a URL entry; no active public page missing
    - **Property 20: Slug Format Invariant** — `generateSlug` always produces `^[a-z0-9]+(-[a-z0-9]+)*$` for any input string
    - Test file: `__tests__/property/seo.property.test.ts`
    - **Validates: Requirements 9.1, 9.2, 9.5**

- [ ] 15. Webhook revalidation API endpoint
  - [~] 15.1 Create `app/api/revalidate/route.ts` Sanity webhook handler
    - Validate HMAC webhook signature using `parseBody` from `next-sanity` and `SANITY_WEBHOOK_SECRET` (return 401 on failure)
    - Route by `_type`: `product` → `revalidateTag('catalogue')` + `revalidateTag('product-{slug}')`; `collection` → `revalidateTag('collections')` + `revalidateTag('collection-{slug}')`; `heroBanner` | `siteSettings` → `revalidateTag('homepage')`
    - Return `{ revalidated: true, now: Date.now() }` on success
    - Log errors to server console; never expose internal errors in response body
    - _Requirements: 1.3, 6.4, 8.4_

- [ ] 16. Embedded Sanity Studio
  - [~] 16.1 Create `app/studio/[[...tool]]/page.tsx` for embedded Sanity Studio
    - Use `NextStudio` from `next-sanity/studio`; import `sanity.config.ts`
    - Add `export const dynamic = 'force-dynamic'` to prevent static generation of studio route
    - Add route to `robots.txt` or Next.js metadata `robots` config to disallow indexing of `/studio`
    - _Requirements: 8.1–8.6_

- [ ] 17. Responsive design and accessibility polish
  - [~] 17.1 Audit all pages for responsive layout correctness (320 px–2560 px)
    - Verify no horizontal scroll, no overlapping elements, no clipped content at each Tailwind breakpoint
    - Cap max container width at 1440 px using `max-w-screen-2xl mx-auto` (Req 7.1)
    - Apply `sm:` 2-col, `lg:` 3-col, `xl:` 4-col grid classes to all `ProductGrid` instances
    - _Requirements: 7.1_

  - [~] 17.2 Audit and apply WCAG 2.1 AA accessibility requirements across all components
    - Verify all product/banner images have non-empty `alt` text; decorative images have `alt=""` (Req 7.2)
    - Add `focus-visible:ring-2 ring-offset-2` focus indicator to every interactive element; verify 3:1 contrast ratio of ring colour (Req 7.3)
    - Verify body text and interactive element colour contrast meets 4.5:1; large text meets 3:1 (Req 7.4)
    - Add `role="navigation"` and `aria-label` to all `<nav>` landmarks; add `id="main-content"` to `<main>` (Req 7.3)
    - Verify all form fields have associated `<label>` elements (Req 7.3)
    - _Requirements: 7.2, 7.3, 7.4_

  - [ ]* 17.3 Write property test for image alt text coverage
    - **Property 22: Product Image Alt Text** — every `<Image>` rendered for a product has a non-empty `alt` attribute
    - Test file: `__tests__/property/product.property.test.ts`
    - **Validates: Requirements 7.2**

- [ ] 18. Unit tests for specific UI interactions and edge cases
  - [ ]* 18.1 Write unit tests for homepage, navigation, and gallery
    - Homepage renders hero banner, new arrivals section, and featured collection section
    - Product gallery prev/next navigation changes displayed image correctly
    - Hamburger menu opens and closes on mobile viewport
    - Test file: `__tests__/unit/homepage.test.ts`, `__tests__/unit/gallery.test.ts`
    - _Requirements: 1.1, 3.2, 3.3, 7.5_

  - [ ]* 18.2 Write unit tests for selection list and contact form UI
    - Clear All prompts confirmation dialog, then empties list on confirm
    - Contact form shows confirmation banner on success
    - Empty search term shows validation message
    - No-results state displays on filtered catalogue with no matches
    - Empty selection list shows empty state with catalogue link
    - Test file: `__tests__/unit/selectionList.test.ts`, `__tests__/unit/contactFormValidation.test.ts`
    - _Requirements: 5.7, 5.8, 4.4, 2.8, 10.4_

  - [ ]* 18.3 Write unit tests for slug generation and new arrivals fallback
    - `generateSlug` produces correct output for known inputs (spaces, special chars, mixed case)
    - New arrivals fallback to 8 most recent when 30-day window is empty (no "New" badge)
    - Test file: `__tests__/unit/slugGeneration.test.ts`, `__tests__/unit/newArrivals.test.ts`
    - _Requirements: 1.6, 9.5_

- [ ] 19. Integration tests for webhook and email
  - [ ]* 19.1 Write integration tests for Sanity webhook revalidation handler
    - Valid signature with `_type: "product"` → calls `revalidateTag` for `catalogue` and `product-{slug}`
    - Valid signature with `_type: "heroBanner"` → calls `revalidateTag` for `homepage`
    - Invalid/missing signature → returns 401, no revalidation
    - Test file: `__tests__/integration/revalidate.test.ts`
    - _Requirements: 1.3, 6.4, 8.4_

  - [ ]* 19.2 Write integration test for contact form Resend email sending
    - Valid form data → Resend `emails.send` called with correct `to`, `from`, `subject`, `text`
    - Resend error → Server Action returns `{ success: false, sendError: true }`
    - Test file: `__tests__/integration/contactForm.integration.test.ts`
    - _Requirements: 10.4, 10.6_

- [~] 20. Final checkpoint — all tests passing
  - Ensure all tests pass, ask the user if questions arise.

---

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP; they do not block the core implementation
- All property tests use `fast-check` with a minimum of 100 iterations each, tagged `// Feature: ladies-wear-boutique-website, Property N: <property text>`
- The design uses TypeScript throughout; all implementation tasks target TypeScript + Next.js 14 App Router
- Arbitraries needed for property tests: `ProductArb`, `CollectionArb`, `CategoryArb`, `SelectionListItemArb`, `FilterStateArb`, `SearchTermArb`
- Sanity Studio is embedded at `/studio` and should be excluded from public indexing
- The `SelectionListBadge` and all selection list interactions are Client Components; all CMS data fetching is Server Components
- ISR revalidation ensures content changes appear within ≤60 seconds (Req 1.3, 6.4, 8.4)
- Lighthouse CI target: ≥80 performance score on mobile preset for homepage, catalogue, and product detail pages (Req 9.6)

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2", "1.3", "1.4", "1.5"] },
    { "id": 1, "tasks": ["2.1", "2.2", "2.3", "2.4", "2.5"] },
    { "id": 2, "tasks": ["3.1", "3.2"] },
    { "id": 3, "tasks": ["3.3"] },
    { "id": 4, "tasks": ["3.4", "4.1", "4.2"] },
    { "id": 5, "tasks": ["4.3", "4.4", "5.1", "5.3", "5.4"] },
    { "id": 6, "tasks": ["5.2", "6.1", "10.1"] },
    { "id": 7, "tasks": ["6.2", "6.3", "7.1", "7.2", "7.3", "9.1", "10.3"] },
    { "id": 8, "tasks": ["7.4", "8.1", "9.2", "11.1"] },
    { "id": 9, "tasks": ["8.2", "8.3", "8.4", "8.5", "11.2", "12.1", "12.2"] },
    { "id": 10, "tasks": ["8.6", "11.3", "12.3"] },
    { "id": 11, "tasks": ["8.7", "12.4", "14.1", "14.2", "15.1", "16.1"] },
    { "id": 12, "tasks": ["14.3", "17.1", "17.2"] },
    { "id": 13, "tasks": ["17.3", "18.1", "18.2", "18.3"] },
    { "id": 14, "tasks": ["19.1", "19.2"] }
  ]
}
```
