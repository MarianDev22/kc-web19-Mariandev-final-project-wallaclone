import * as zod from 'zod';

export const authSignupValidator = zod.object({
  username: zod.string().trim().min(1),
  email: zod.string().trim().toLowerCase().pipe(zod.email()),
  password: zod.string().min(6).max(64),
});

export const authLoginValidator = zod.object({
  username: zod.string().trim().min(1),
  password: zod.string().min(6).max(64),
});

export const updateUserValidator = zod
  .object({
    username: zod.string().trim().min(1).optional(),
    email: zod.string().trim().toLowerCase().pipe(zod.email()).optional(),
    currentPassword: zod.string().min(6).max(64).optional(),
    newPassword: zod.string().min(6).max(64).optional(),
  })
  .refine(
    ({ username, email, newPassword }) =>
      username !== undefined || email !== undefined || newPassword !== undefined,
    {
      error: 'Debes enviar al menos un dato para actualizar',
    },
  )
  .refine(
    ({ currentPassword, newPassword }) =>
      newPassword === undefined || currentPassword !== undefined,
    {
      error: 'Debes indicar tu contraseña actual para cambiarla',
      path: ['currentPassword'],
    },
  );
