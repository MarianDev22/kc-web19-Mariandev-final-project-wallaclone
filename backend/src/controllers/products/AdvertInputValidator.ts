import * as z from 'zod';

export const createAdBodyValidator = z.object({
  name: z.string(),
  description: z.string().max(200),
  price: z.coerce.number(),
  isSale: z.coerce.boolean(),
  image: z.string().optional(),
  tags: z.string().array().optional(),
});

export const getAdvertsQueryValidator = z.object({
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(10),
  search: z.string().min(3).optional(),
});