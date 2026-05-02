import { NextFunction, Request, Response } from 'express';
import {
  EntityNotFoundError,
  ForbiddenOperationError,
  UnauthorizedError,
} from '../../errors/domainError';
import { mongoIdValidator, updateAdValidator } from './AdvertInputValidator';
import { Advert } from '../../models/Advert';

export const updateAdvertController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Usuario no autenticado');
    }
    const dataToUpdate = updateAdValidator.parse(req.body);
    const { id } = mongoIdValidator.parse(req.params);

    const advertToUpdate = await Advert.findById(id);
    if (!advertToUpdate) {
      throw new EntityNotFoundError('anuncio', 'id');
    }
    if (advertToUpdate.ownerId.toString() !== req.user.id) {
      throw new ForbiddenOperationError('No tiene permisos para editar este anuncio');
    }
    advertToUpdate.set(dataToUpdate);
    const updatedAdvert = await advertToUpdate.save();

    res.status(200).json({
      id: updatedAdvert._id,
      name: updatedAdvert.name,
      description: updatedAdvert.description,
      price: updatedAdvert.price,
      isSale: updatedAdvert.isSale,
      ownerId: updatedAdvert.ownerId,
      image: updatedAdvert.image,
      status: updatedAdvert.status,
      message: 'Anuncio actualizado con éxito',
    });
  } catch (error) {
    next(error);
  }
};
