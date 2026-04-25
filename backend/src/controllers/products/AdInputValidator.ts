import * as z from 'zod';

const createAdBodyValidator = z.object({
  name: z.string(),
  description: z.string().max(200),
  price: z.coerce.number(),
  author: z.string(),
  isSale: z.boolean(),
  image: z.string(),
  tags: z.string().array(),
});
