// All GROQ query constants for the Pratima Boutique website

// ---------------------------------------------------------------------------
// Homepage
// ---------------------------------------------------------------------------

/** Active hero banner (only one active at a time) */
export const HERO_BANNER_QUERY = `
  *[_type == "heroBanner" && isActive == true][0] {
    _id,
    altText,
    headline,
    subheadline,
    ctaLabel,
    ctaLink,
    "image": {
      "asset": {
        "url": image.asset->url,
        "metadata": { "lqip": image.asset->metadata.lqip }
      }
    }
  }
`;

/** New arrivals: active products added within last 30 days, newest first, max 8 */
export const NEW_ARRIVALS_QUERY = `
  *[_type == "product" && isActive == true
    && dateTime(_createdAt) > dateTime(now()) - 60*60*24*30]
    | order(_createdAt desc)[0...8] {
      _id,
      _createdAt,
      name,
      slug,
      price,
      originalPrice,
      "thumbnail": images[0].asset.asset->url,
      "blurDataUrl": images[0].asset.asset->metadata.lqip
    }
`;

/**
 * Fallback new arrivals: when no products exist within the 30-day window,
 * return the 8 most recently added active products (no "New" badge for these).
 */
export const NEW_ARRIVALS_FALLBACK_QUERY = `
  *[_type == "product" && isActive == true]
    | order(_createdAt desc)[0...8] {
      _id,
      _createdAt,
      name,
      slug,
      price,
      originalPrice,
      "thumbnail": images[0].asset.asset->url,
      "blurDataUrl": images[0].asset.asset->metadata.lqip
    }
`;

/** Site settings singleton (featured collections + meta) */
export const SITE_SETTINGS_QUERY = `
  *[_type == "siteSettings"][0] {
    metaTitle,
    metaDescription,
    "featuredCollections": featuredCollections[]->{
      _id,
      name,
      slug,
      description,
      isActive,
      "coverImage": {
        "asset": {
          "url": coverImage.asset.asset->url,
          "metadata": { "lqip": coverImage.asset.asset->metadata.lqip }
        },
        "altText": coverImage.altText
      },
      "products": products[]->{
        _id,
        _createdAt,
        name,
        slug,
        price,
        originalPrice,
        isActive,
        "thumbnail": images[0].asset.asset->url,
        "blurDataUrl": images[0].asset.asset->metadata.lqip
      }
    }
  }
`;

// ---------------------------------------------------------------------------
// Catalogue
// ---------------------------------------------------------------------------

/**
 * All active products for the catalogue.
 * Supports optional category/colour/size filter params and sort order.
 * Params: $categorySlug (string|null), $colour (string|null), $size (string|null), $sort ("newest"|"price-asc"|"price-desc")
 */
export const CATALOGUE_QUERY = `
  *[_type == "product" && isActive == true
    && (count($categorySlugs) == 0 || count(categories[]->slug.current[@ in $categorySlugs]) > 0)
    && (count($colours) == 0 || count(variants[colour in $colours]) > 0)
    && (count($sizes) == 0 || count(variants[size in $sizes]) > 0)
  ] {
    _id,
    _createdAt,
    name,
    slug,
    price,
    originalPrice,
    isActive,
    "thumbnail": images[0].asset.asset->url,
    "blurDataUrl": images[0].asset.asset->metadata.lqip,
    "categories": categories[]->{_id, name, slug},
    "variants": variants[]{size, colour, inStock}
  }
`;

/** All unique colours across active products (for filter sidebar) */
export const ALL_COLOURS_QUERY = `
  array::unique(*[_type == "product" && isActive == true].variants[].colour)
`;

/** All unique sizes across active products (for filter sidebar) */
export const ALL_SIZES_QUERY = `
  array::unique(*[_type == "product" && isActive == true].variants[].size)
`;

// ---------------------------------------------------------------------------
// Product detail
// ---------------------------------------------------------------------------

/** Full product detail by slug */
export const PRODUCT_BY_SLUG_QUERY = `
  *[_type == "product" && slug.current == $slug && isActive == true][0] {
    _id,
    _createdAt,
    name,
    slug,
    description,
    price,
    originalPrice,
    isActive,
    "images": images[]{
      altText,
      "url": asset.asset->url,
      "lqip": asset.asset->metadata.lqip,
      "width": asset.asset->metadata.dimensions.width,
      "height": asset.asset->metadata.dimensions.height
    },
    "categories": categories[]->{_id, name, slug},
    "collections": collections[]->{_id, name, slug},
    "variants": variants[]{_key, size, colour, inStock}
  }
`;

/**
 * Related products: same collection first, then same category, excluding self.
 * Params: $productId, $collectionIds (array), $categoryIds (array)
 */
export const RELATED_PRODUCTS_QUERY = `
  *[_type == "product" && isActive == true && _id != $productId
    && (count(collections[@._ref in $collectionIds]) > 0 || count(categories[@._ref in $categoryIds]) > 0)
  ] | order(
    count(collections[@._ref in $collectionIds]) desc,
    _createdAt desc
  )[0...6] {
    _id,
    _createdAt,
    name,
    slug,
    price,
    originalPrice,
    "thumbnail": images[0].asset.asset->url,
    "blurDataUrl": images[0].asset.asset->metadata.lqip
  }
`;

// ---------------------------------------------------------------------------
// Collections
// ---------------------------------------------------------------------------

/** All active collections for the collections index page */
export const COLLECTIONS_INDEX_QUERY = `
  *[_type == "collection" && isActive == true] | order(_createdAt desc) {
    _id,
    name,
    slug,
    description,
    "coverImage": {
      "asset": {
        "url": coverImage.asset->url,
        "metadata": { "lqip": coverImage.asset->metadata.lqip }
      },
      "altText": coverImage.altText
    }
  }
`;

/** Single collection by slug with all its active products */
export const COLLECTION_BY_SLUG_QUERY = `
  *[_type == "collection" && slug.current == $slug && isActive == true][0] {
    _id,
    name,
    slug,
    description,
    isActive,
    "coverImage": {
      "asset": {
        "url": coverImage.asset->url,
        "metadata": {
          "lqip": coverImage.asset->metadata.lqip,
          "dimensions": {
            "width": coverImage.asset->metadata.dimensions.width,
            "height": coverImage.asset->metadata.dimensions.height
          }
        }
      },
      "altText": coverImage.altText
    },
    "products": products[]->[isActive == true] {
      _id,
      _createdAt,
      name,
      slug,
      price,
      originalPrice,
      "thumbnail": images[0].asset->url,
      "blurDataUrl": images[0].asset->metadata.lqip
    }
  }
`;

// ---------------------------------------------------------------------------
// Search (no cache — always fresh)
// ---------------------------------------------------------------------------

/**
 * Full-text search across product name, description, and category name.
 * Uses GROQ match operator for case-insensitive substring matching.
 * Param: $term (string)
 */
export const SEARCH_QUERY = `
  *[_type == "product" && isActive == true && (
    name match $term + "*" ||
    pt::text(description) match $term + "*" ||
    count(categories[name match $term + "*"]) > 0
  )] | order(_createdAt desc) {
    _id,
    _createdAt,
    name,
    slug,
    price,
    originalPrice,
    "thumbnail": images[0].asset->url,
    "blurDataUrl": images[0].asset->metadata.lqip
  }
`;

// ---------------------------------------------------------------------------
// Sitemap / static params
// ---------------------------------------------------------------------------

/** All active product slugs (for generateStaticParams and sitemap) */
export const ALL_PRODUCT_SLUGS_QUERY = `
  *[_type == "product" && isActive == true].slug.current
`;

/** All active collection slugs (for generateStaticParams and sitemap) */
export const ALL_COLLECTION_SLUGS_QUERY = `
  *[_type == "collection" && isActive == true].slug.current
`;

/** All categories (for filter sidebar and sitemap) */
export const ALL_CATEGORIES_QUERY = `
  *[_type == "category"] | order(name asc) {
    _id,
    name,
    slug
  }
`;
