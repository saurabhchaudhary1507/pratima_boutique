import type { PortableTextBlock } from '@/types';

/**
 * Extracts plain text from a Portable Text block array.
 * Used for generating meta descriptions from product/collection descriptions.
 */
export function portableTextToPlainText(blocks: PortableTextBlock[]): string {
  return blocks
    .filter((block) => block._type === 'block')
    .map((block) =>
      (block.children ?? [])
        .filter((child) => child._type === 'span')
        .map((child) => child.text)
        .join('')
    )
    .join(' ')
    .trim();
}
