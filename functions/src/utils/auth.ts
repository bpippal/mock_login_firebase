import { Request, Response, NextFunction } from 'express';
import { unauthorizedException } from './apiErrorHandler';
import { logger } from 'firebase-functions/v1';
import { verifyJwt , decodeJwt } from './jwt';

export const isAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bearer = req.headers['authorization'];
    if (!bearer) throw unauthorizedException('No token provided');

    // TODO
    verifyJwt(bearer , "access");

    let decodedToken : any = decodeJwt(bearer , "access");
    
    req.user = { user_id : decodedToken.id , name : decodedToken.name };

    next();
  } catch (err) {
    logger.warn(err);
    next(err);
  }
};
