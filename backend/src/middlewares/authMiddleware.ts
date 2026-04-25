import { NextFunction, Request, Response } from 'express';
import { SecurityBcryptService } from '../../infrastructure/services/security-bcrypt-service';
import { UnauthorizedError } from '../../domain/types/error';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authenticationHeader = req.headers.authorization; // Bearer eyfdfspdfnsf
  const token = authenticationHeader?.split(' ')[1];
  if (!token) {
    throw new UnauthorizedError(`Error getting jwt token from Authorization header`);
  };
    
  
  //verify token
  const securityService = new SecurityBcryptService();

  const data = securityService.verifyJWT(token);

  req.user = {
    id: data.userId,
  };

  next();
};