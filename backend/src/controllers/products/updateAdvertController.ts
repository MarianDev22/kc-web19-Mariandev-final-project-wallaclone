import { NextFunction, Request, Response } from 'express';
import {
  EntityNotFoundError,
  ForbiddenOperationError,
  UnauthorizedError,
} from '../../errors/domainError';
import { updateAdValidator } from './AdvertInputValidator';
import { Advert } from '../../models/Advert';
import { User } from '../../models/User';

export const updateAdvertController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Usuario no autenticado');
    }
    const { name, description, price, isSale, image, tags } = updateAdValidator.parse(req.body);
    //TODO: aca va la validacion de la mongoId, pero como la tengo cojo la id sin validar
    const advertInfoToUpdate = new Advert({
      name,
      description,
      price,
      isSale,
      image,
      tags,
    });

    const { id } = req.params;

    const advertToUpdate = await Advert.findById(id);
    if (!advertToUpdate) {
      throw new EntityNotFoundError('anuncio', 'id');
    }
    if (advertToUpdate.ownerId.toString() !== req.user.id) {
      throw new ForbiddenOperationError('No tiene permisos para editar este anuncio');
    }

    const updatedAdvert = await Advert.updateOne(id, advertInfoToUpdate);

    res.status(200).json({
      id: updatedAdvert._id,
      name: updatedAdvert.name,
      price: updatedAdvert.price,
      isSale: updatedAdvert.isSale,
      ownerId: updatedAdvert.ownerId,
      status: updatedAdvert.status,
      message: 'Anuncio creado con éxito',
    });
  } catch (error) {
    next(error);
  }
};
