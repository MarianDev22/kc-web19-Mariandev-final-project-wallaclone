import type { RequestHandler } from 'express';
import {
    EntityNotFoundError,
    ForbiddenOperationError,
    UnauthorizedError,
} from '../../errors/domainError';
import { Advert } from '../../models/Advert';
import {
    mongoIdValidator,
    updateAdvertStatusValidator,
} from './AdvertInputValidator';
import { mapAdvertToResponse } from './advertResponseMapper';

export const updateAdvertStatusController: RequestHandler = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new UnauthorizedError('Usuario no autenticado');
        }

        const { status } = updateAdvertStatusValidator.parse(req.body);
        const { id } = mongoIdValidator.parse(req.params);

        const advertToUpdate = await Advert.findById(id);

        if (!advertToUpdate) {
            throw new EntityNotFoundError('anuncio', id);
        }

        if (advertToUpdate.ownerId.toString() !== req.user.id) {
            throw new ForbiddenOperationError(
                'No tienes permisos para cambiar el estado de este anuncio'
            );
        }

        advertToUpdate.status = status;

        const updatedAdvert = await advertToUpdate.save();

        res.status(200).json({
            ...mapAdvertToResponse(updatedAdvert),
            message: 'Estado del anuncio actualizado con éxito',
        });
    } catch (error) {
        next(error);
    }
};
