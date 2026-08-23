/**
 * Generates a URL-safe slug from any string.
 * Pattern: ^[a-z0-9]+(-[a-z0-9]+)*$
 * - Converts to lowercase
 * - Replaces spaces and special characters with hyphens
 * - Collapses consecutive hyphens
 * - Strips leading/trailing hyphens
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // remove non-alphanumeric except spaces and hyphens
    .replace(/\s+/g, '-')         // replace whitespace runs with single hyphen
    .replace(/-+/g, '-')          // collapse consecutive hyphens
    .replace(/^-|-$/g, '');       // strip leading/trailing hyphens
}
