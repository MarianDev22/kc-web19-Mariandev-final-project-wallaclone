import { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../errors/domainError';
import { securityService } from '../controllers/authentication/securityService';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authenticationHeader = req.headers.authorization; // Authorization: Bearer <token>
  if(!authenticationHeader) {
    throw new UnauthorizedError ('Authorization header missing');
  }
  const [isBearer, token] = authenticationHeader?.split(' ');
  if (isBearer !== "Bearer" || !token) {
    throw new UnauthorizedError('Invalid authorization format');
  }

  //verify token

  const data = securityService.verifyJWT(token);

  req.user = {
    id: data.userId,
  };
  next();
};
