import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_ACCESS_SECTER_KEY } from '../config';
import { APIError } from '../error/apiError';

export const verifyUser = (token: string | undefined) => {
  if (token) {
    token = token.split(' ')[1] || '';
    const user = jwt.verify(token, JWT_ACCESS_SECTER_KEY);
    return user;
  } else {
    throw new APIError(401, 'Token not provided');
  }
};

export const verifyUserMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1] || '';
  const user = jwt.verify(token, JWT_ACCESS_SECTER_KEY);
  res.locals.user = user;
  next();
};

export const verifyAdminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1] || '';
  const user = jwt.verify(token, JWT_ACCESS_SECTER_KEY);

  if ((<any>user).userRole === 'admin') {
    res.locals.user = user;
  } else {
    throw new APIError(403, 'Admins only');
  }

  next();
};
