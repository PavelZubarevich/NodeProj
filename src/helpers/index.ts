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
