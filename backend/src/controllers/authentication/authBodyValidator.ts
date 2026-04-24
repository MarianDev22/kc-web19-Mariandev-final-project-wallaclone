import * as zod from 'zod';

export const authSignupValidator = zod.object({
  username: zod.string(),
  email: zod.email(),
  password: zod.string(),
});

export const authLoginValidator = zod.object({
  username: zod.string(),
  password: zod.string(),
});