import { defineField, defineType } from 'sanity';

export const siteSettingsSchema = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  // The desk structure in sanity.config.ts exposes this as a singleton.
  fields: [
    defineField({
      name: 'featuredCollections',
      title: 'Featured Collections',
      description: 'Up to 3 collections shown on the homepage',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'collection' }] }],
      validation: (Rule) => Rule.max(3),
    }),
    defineField({
      name: 'metaTitle',
      title: 'Homepage Meta Title',
      type: 'string',
      description: 'Max 60 characters',
      validation: (Rule) => Rule.max(60),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Homepage Meta Description',
      type: 'text',
      rows: 3,
      description: 'Max 160 characters',
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: 'ownerImage',
      title: 'Owner Photo',
      description: 'Optional photo shown on the Contact Us page',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'altText',
          title: 'Alt text',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'metaTitle' },
    prepare({ title }) {
      return { title: title || 'Site Settings' };
    },
  },
});
