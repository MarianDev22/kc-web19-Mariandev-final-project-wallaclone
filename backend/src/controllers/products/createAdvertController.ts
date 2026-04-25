import { Request, Response, NextFunction } from 'express';
import { createAdBodyValidator } from './AdvertInputValidator';
import { Advert } from '../../models/Advert';



export const createAdvertController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, price, isSale, image, tags } = createAdBodyValidator.parse(req.body);




    const newAdvert = new Advert({ name, description, price, isSale, image, tags });
    const createdAdvert = await newAdvert.save();


    // respuesta json: user, token y mensaje
    res.status(201).json({
      user: {
        username: createdUser.username,
      },
      token: newToken,
      message: 'Usuario registrado correctamente',
    });
  } catch (error) {
    next(error);
  }
};
