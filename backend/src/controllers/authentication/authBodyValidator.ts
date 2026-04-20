import * as zod from 'zod';

export const authBodyValidator = zod.object({
  email: zod.email(),
  password: zod.string(),
});
