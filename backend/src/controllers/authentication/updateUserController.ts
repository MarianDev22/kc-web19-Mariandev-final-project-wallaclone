import type { RequestHandler } from 'express';
import {
    BusinessConflictError,
    EntityNotFoundError,
    UnauthorizedError,
} from '../../errors/domainError';
import { User } from '../../models/User';
import { updateUserValidator } from './authBodyValidator';
import { securityService } from './securityService';

export const updateUserController: RequestHandler = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new UnauthorizedError('Usuario no autenticado');
        }

        const { username, email, currentPassword, newPassword } =
            updateUserValidator.parse(req.body);

        const userToUpdate = await User.findById(req.user.id).select('+password');

        if (!userToUpdate) {
            throw new EntityNotFoundError('usuario', req.user.id);
        }

        if (username && username !== userToUpdate.username) {
            const existingUsername = await User.findOne({
                username,
                _id: { $ne: req.user.id },
            });

            if (existingUsername) {
                throw new BusinessConflictError(
                    `El nombre de usuario ${username} está en uso`,
                );
            }

            userToUpdate.username = username;
        }

        if (email && email !== userToUpdate.email) {
            const existingEmail = await User.findOne({
                email,
                _id: { $ne: req.user.id },
            });

            if (existingEmail) {
                throw new BusinessConflictError('Ya existe un usuario con este email');
            }

            userToUpdate.email = email;
        }

        if (newPassword) {
            if (!currentPassword) {
                throw new UnauthorizedError(
                    'Debes indicar tu contraseña actual para poder actualizarla',
                );
            }

            if (!userToUpdate.password) {
                throw new UnauthorizedError('No se ha podido validar la contraseña');
            }

            await securityService.comparePasswords(
                currentPassword,
                userToUpdate.password,
            );

            userToUpdate.password = await securityService.hashPassword(newPassword);
        }

        const updatedUser = await userToUpdate.save();

        res.status(200).json({
            user: {
                id: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email,
            },
            message: 'Datos de usuario actualizados correctamente',
        });
    } catch (error) {
        next(error);
    }
};
