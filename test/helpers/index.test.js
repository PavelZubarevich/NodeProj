const { verifyUser, generateTokens } = require('../../src/helpers');
const { APIError } = require('../../src/error/apiError');
const jwt = require('jsonwebtoken');
const { JWT_ACCESS_SECTER_KEY } = require('../../src/config');

describe('testing verifyUser function', () => {
  test('verify user shoud be a function', () => {
    expect(typeof verifyUser).toBe('function');
  });
  test('verify user should return error for empty token', () => {
    expect(() => verifyUser('')).toThrow(APIError);
  });

  test('invalid token should return JWTError', () => {
    expect(() => verifyUser('jkdfn')).toThrow(jwt.JsonWebTokenError);
  });

  test('should return object', () => {
    const accessToken = jwt.sign({ userId: 'userId', userRole: 'userRole' }, JWT_ACCESS_SECTER_KEY, {
      expiresIn: '15m'
    });

    expect(verifyUser(`bearer ${accessToken}`)).toMatchObject({
      userId: expect.any(String),
      userRole: expect.any(String),
      exp: expect.any(Number),
      iat: expect.any(Number)
    });
  });
});

describe('testing generateTokens function', () => {
  test('sould return tokens', () => {
    expect(generateTokens()).toMatchObject({
      accessToken: expect.any(String),
      refreshToken: expect.any(String)
    });
  });
});
