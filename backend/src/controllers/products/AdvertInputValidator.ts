import * as z from 'zod';

export const createAdBodyValidator = z.object({
  name: z.string().trim().min(5),
  description: z.string().trim().min(5).max(200),
  price: z.coerce.number().nonnegative({message:"El precio tien que ser mayor a cero"}),
  isSale: z.coerce.boolean(),
  image: z.string().url().optional(),
  tags: z.array(z.string().trim().min(1)).optional(),
});
