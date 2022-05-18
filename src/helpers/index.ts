import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_ACCESS_SECTER_KEY, JWT_REFRESH_SECTER_KEY } from '../config';
import { APIError } from '../error/apiError';
import { validationResult } from 'express-validator';
import SessionRepository from '../repository/sessionRepository';
import { UserRepository } from '../repository';

export const generateTokens = (userId: string, userRole: string | undefined) => {
  const accessToken = jwt.sign({ userId, userRole }, JWT_ACCESS_SECTER_KEY, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ userId, userRole }, JWT_REFRESH_SECTER_KEY, { expiresIn: '50d' });
  return {
    accessToken,
    refreshToken
  };
};

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

export const validateQueryDataMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new APIError(400, `Infalid params: ${errors.array()[0].param}=${errors.array()[0].value}`);
  }
  next();
};

export const updateTokens = (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.headers.authorization?.split(' ')[1] || '';

  jwt.verify(accessToken, JWT_ACCESS_SECTER_KEY, async (err) => {
    if (err?.message === 'jwt expired') {
      const cookieToken = req.headers.cookie?.split('=')[1];
      const session = await SessionRepository.getSession({ refreshToken: cookieToken });

      if (session) {
        const user = await UserRepository.getUser({ userName: session.userName });
        if (user) {
          const { accessToken, refreshToken } = generateTokens(user._id, user.role);
          res.cookie('RefreshToken', refreshToken, { httpOnly: true });
          await SessionRepository.updateOne({ refreshToken: cookieToken }, { refreshToken });

          req.headers.authorization = `Bearer ${accessToken}`;
        }
      }
      next();
    } else {
      next();
    }
  });
};
