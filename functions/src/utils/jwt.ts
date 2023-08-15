import { badImplementationException , unauthorizedException } from './apiErrorHandler';
import jwt from 'jsonwebtoken';
import { logger } from 'firebase-functions/v1';


export const encodeJwt = (
  payload: string | Record<string, unknown> | Buffer,
  expiresIn: string | number,
  secret: 'refresh' | 'access' | 'default' = 'default',
) => {
  try {
    const SECRET =
      secret === 'refresh'
        ? process.env.JWT_REFRESH_SECRET
        : secret === 'access'
        ? process.env.JWT_ACCESS_SECRET
        : process.env.JWT_SECRET;
    if (!SECRET) throw badImplementationException('SECRET is not defined on env file');

    // TODO
    return jwt.sign(payload , SECRET , {expiresIn : expiresIn});
  } catch (err: any) {
    logger.log(err);
    throw badImplementationException('Something went wrong during encoding jwt');
  }
};

export const decodeJwt = (jwtoken: string, secret: 'refresh' | 'access' | 'default' = 'default') => {
  try {
    const SECRET =
      secret === 'refresh'
        ? process.env.JWT_REFRESH_SECRET
        : secret === 'access'
        ? process.env.JWT_ACCESS_SECRET
        : process.env.JWT_SECRET;
    if (!SECRET) throw badImplementationException('SECRET is not defined on env file');

    // TODO

    return jwt.decode(jwtoken); 

  } catch (err: any) {
    logger.log(err);
    throw badImplementationException('Something went wrong during decoding jwt');
  }
};

export const verifyJwt = (jwtoken: string, secret: 'refresh' | 'access' | 'default' = 'default') => {
  try {
    const SECRET =
      secret === 'refresh'
        ? process.env.JWT_REFRESH_SECRET
        : secret === 'access'
        ? process.env.JWT_ACCESS_SECRET
        : process.env.JWT_SECRET;
    if (!SECRET) throw badImplementationException('SECRET is not defined on env file');

    // TODO
    return jwt.verify(jwtoken , SECRET);

  } catch (err: any) {
    if(err && err.message === "jwt expired"){
      throw unauthorizedException("Token Expired");
    }
    logger.log(err);
    throw unauthorizedException("Token verification failed");
  }
};