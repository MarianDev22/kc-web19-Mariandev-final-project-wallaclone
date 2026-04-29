import * as z from 'zod';

export const createAdBodyValidator = z.object({
  name: z.string().trim().min(5),
  description: z.string().trim().min(5).max(200),
  price: z.coerce.number().nonnegative({ message: 'El precio tien que ser mayor a cero' }),
  isSale: z.boolean(),
  image: z.url(),
  tags: z.array(z.string().trim().min(1)).optional(),
});

export const getAdvertsQueryValidator = z
  .object({
    name: z.string().trim().min(1).optional(),
    minPrice: z.coerce.number().nonnegative().optional(),
    maxPrice: z.coerce.number().nonnegative().optional(),
    tag: z.string().trim().min(1).optional(),
    page: z.coerce.number().nonnegative().int().positive().default(1),
    limit: z.coerce.number().nonnegative().positive().int().max(100).default(10),
  })
  .refine(
    ({ minPrice, maxPrice }) =>
      minPrice === undefined || maxPrice === undefined || minPrice <= maxPrice,
    {
      message: 'minPrice must be less than or equal to maxPrice',
      path: ['minPrice'],
    }
  );
