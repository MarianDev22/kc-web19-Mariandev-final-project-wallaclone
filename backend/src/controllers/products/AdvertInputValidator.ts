import * as z from 'zod';

const trimmedString = z.string().trim();

const positivePrice = z.coerce.number().positive({
  error: 'El precio tiene que ser mayor a cero',
});

const nonNegativeNumber = z.coerce.number().nonnegative();

const paginationValidator = {
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
};

const hasValidPriceRange = ({
  minPrice,
  maxPrice,
}: {
  minPrice?: number;
  maxPrice?: number;
}) => {
  return minPrice === undefined || maxPrice === undefined || minPrice <= maxPrice;
};

export const createAdBodyValidator = z.object({
  name: trimmedString.min(2, {
    error: 'El nombre debe tener al menos 2 caracteres',
  }),
  description: trimmedString.min(5).max(200),
  price: positivePrice,
  isSale: z.boolean(),
  image: z.url(),
  tags: z.array(trimmedString.min(1)).optional(),
});

export const getAdvertsQueryValidator = z
  .object({
    name: trimmedString.min(1).optional(),
    minPrice: nonNegativeNumber.optional(),
    maxPrice: nonNegativeNumber.optional(),
    tag: trimmedString.min(1).optional(),
    ...paginationValidator,
  })
  .refine(hasValidPriceRange, {
    error: 'El precio mínimo debe ser menor o igual que el precio máximo',
    path: ['minPrice'],
  });
