import type { SchemaTypeDefinition } from 'sanity';
import { categorySchema } from './category';
import { productSchema } from './product';
import { collectionSchema } from './collection';
import { heroBannerSchema } from './heroBanner';
import { siteSettingsSchema } from './siteSettings';

export const schemaTypes: SchemaTypeDefinition[] = [
  categorySchema,
  productSchema,
  collectionSchema,
  heroBannerSchema,
  siteSettingsSchema,
];
