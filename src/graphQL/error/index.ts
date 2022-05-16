import { ErrorsType } from '../types';

export const errors: ErrorsType = {
  USER_ALREADY_EXISTS: {
    message: 'User already exists',
    statusCode: 403
  },
  USER_NOT_FOUND: {
    message: 'User not found',
    statusCode: 401
  },
  INCORRECT_PASSWORD: {
    message: 'Incorrect password',
    statusCode: 401
  }
};
