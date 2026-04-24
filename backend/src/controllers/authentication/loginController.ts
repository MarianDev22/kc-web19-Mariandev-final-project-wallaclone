import { Request, Response, NextFunction } from 'express';
import { User } from '../../models/User';
import { securityService } from './securityService';
import { UnauthorizedError } from '../../errors/domainError';
import { authLoginValidator } from './authBodyValidator';

export const loginController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = authLoginValidator.parse(req.body);
    // Forzamos la selección del campo 'password' que está marcado como 'select: false' en el modelo
    const existingUser = await User.findOne({ username }).select('+password');

    if (!existingUser) {
      throw new UnauthorizedError('Credenciales incorrectas');
    }
    if (!existingUser.password) {
      throw new UnauthorizedError('Credenciales incorrectas');
    }
    await securityService.comparePasswords(password, existingUser.password);

    const newToken = securityService.generateJWT(existingUser._id.toString());

    // respuesta json: user, token y mensaje
    res.status(200).json({
      user: {
        username: existingUser.username,
        id: existingUser._id,
      },
      token: newToken,
      message: 'Sesión iniciada correctamente',
    });
  } catch (error) {
    next(error);
  }
};
