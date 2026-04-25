import { Request, Response, NextFunction } from 'express';

export const logoutController = async (req: Request, res: Response) => {

    // respuesta json logout con éxito - si el token se guarda en local storage - vercon Sara
    res.status(200).json({

      message: 'La sesión se ha cerrado con éxito',
    });

};
