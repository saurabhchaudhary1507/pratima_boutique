import { defineField, defineType } from 'sanity';

export const heroBannerSchema = defineType({
  name: 'heroBanner',
  title: 'Hero Banner',
  type: 'document',
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'altText',
      title: 'Alt Text',
      type: 'string',
      description: 'Describe the banner image for screen readers and SEO',
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      validation: (Rule) => Rule.required().min(1).max(100),
    }),
    defineField({
      name: 'subheadline',
      title: 'Subheadline',
      type: 'string',
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: 'ctaLabel',
      title: 'CTA Button Label',
      type: 'string',
      description: 'Text for the call-to-action button (optional)',
    }),
    defineField({
      name: 'ctaLink',
      title: 'CTA Button Link',
      type: 'string',
      description: 'URL or path the CTA button links to (e.g. /catalogue)',
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      description: 'Only one banner should be active at a time',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'headline',
      subtitle: 'isActive',
      media: 'image',
    },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle: subtitle ? '✅ Active' : '⏸ Inactive',
        media,
      };
    },
  },
});
