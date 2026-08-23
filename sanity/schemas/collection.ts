import { defineField, defineType } from 'sanity';

export const collectionSchema = defineType({
  name: 'collection',
  title: 'Collection',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required().min(1).max(200),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
        slugify: (input: string) =>
          input
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, ''),
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'object',
      fields: [
        defineField({
          name: 'asset',
          title: 'Image',
          type: 'image',
          options: { hotspot: true },
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'altText',
          title: 'Alt Text',
          type: 'string',
          validation: (Rule) => Rule.required().min(1),
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'products',
      title: 'Products',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'product' }] }],
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      description: 'Deactivate to hide this collection from the website',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'coverImage.asset',
    },
  },
});
