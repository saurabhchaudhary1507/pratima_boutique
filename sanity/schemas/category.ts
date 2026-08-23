import { defineField, defineType } from 'sanity';

export const categorySchema = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required().min(1).max(100),
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
      validation: (Rule) =>
        Rule.required().custom((slug) => {
          if (!slug?.current) return 'Slug is required';
          const pattern = /^[a-z0-9]+(-[a-z0-9]+)*$/;
          return pattern.test(slug.current) || 'Slug must only contain lowercase letters, digits, and hyphens';
        }),
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'slug.current' },
  },
});
