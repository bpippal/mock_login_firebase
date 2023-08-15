import { Request, Response, NextFunction } from 'express';
import { logger } from 'firebase-functions/v1';
import { decodeJwt, encodeJwt, verifyJwt } from '../../../utils/jwt';
import * as service from './auth.service';
import { getCurrentJST } from '../../../utils/dayjs';
import {
  badImplementationException,
  dataNotExistException,
  unauthorizedException,
  dataConflictException
} from '../../../utils/apiErrorHandler';
import { getUserByEmail, updateUserFields , getUserById } from '../../../models/user';
import { comparePassword } from '../../../utils/bcrypt';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, name, phone, address } = req.body;

    let user : any = await getUserByEmail(email);
    if(user && user.length){
      throw dataConflictException(`User already exists with email - ${email} `);
    }

    await service.createUser(email, password, name, phone, address);
    res.status(200).json();
  } catch (err: any) {
    logger.error(err);
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
  
    let body = req.body;

    //Fetch userId from email ->
    const userDetails : any = await getUserByEmail(body.email);
    if(userDetails && userDetails.length === 0){
      throw dataNotExistException("User Id not found")
    }
    
    if(userDetails && userDetails.length === 0){
      throw badImplementationException("More than one user found")
    }

    //Compare password
    let isValidPassword = await comparePassword(body.password , userDetails[0].password); 
    if(!isValidPassword){
      throw unauthorizedException("Invalid credentials");
    }

    const user_id : any = userDetails[0].id;

    const { ACCESS_TOKEN_EXPIRED_IN, REFRESH_TOKEN_EXPIRED_IN } = process.env;

    const accessToken = encodeJwt({ id: user_id , name : userDetails[0].name}, ACCESS_TOKEN_EXPIRED_IN || '1m', 'access');
    const refreshToken = encodeJwt({ id: user_id }, REFRESH_TOKEN_EXPIRED_IN || '2m', 'refresh');

    // TODO update refresh token
    userDetails[0].status = "active";
    userDetails[0].updated_at = getCurrentJST();
    userDetails[0].refresh_token = refreshToken;
    await updateUserFields(user_id , userDetails[0]);
    
    res.status(200).json({ accessToken, refreshToken });
  } catch (err: any) {
    logger.error(err);
    next(err);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id } = req.user;
    if (!user_id) throw badImplementationException('user_id is not set properly');

    // TODO updateUser for make the refresh token to be null
    const updateSet : any = {
      refresh_token : null
    }

    await updateUserFields(user_id , updateSet);

    res.status(200).json();
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;

    // TODO implment getUserByEmail to get user detail
    const users = await getUserByEmail(email);
    if (users.length === 0) throw dataNotExistException('Email does not register');
    if (users.length > 1) throw badImplementationException('Something went wrong. Email is more than 1.');
    if (users[0].status !== 'active') throw unauthorizedException('This user is unauthorized.');

    service.forgotPassword(users[0]);

    res.status(200).json();
  } catch (err: any) {
    logger.error(err);
    next(err);
  }
};

export const updatePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { password, tokenId } = req.body;

    await service.updatePassword(password, tokenId);

    res.status(200).json();
  } catch (err: any) {
    logger.error(err);
    next(err);
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;
    verifyJwt(refreshToken , "refresh");
    console.log("🚀bharat ~ file: auth.controller.ts:128 ~ refresh ~ refreshToken:", refreshToken);
    const decoded : any = decodeJwt(refreshToken, 'refresh');

    // TODO get user by id
    const user = await getUserById(decoded.id);
    if (!user) throw unauthorizedException('User is not exist');
    if (user.status !== 'active') throw unauthorizedException('This user is not active');
    if (user.refresh_token !== refreshToken) throw unauthorizedException('Refresh token is not valid');

    const { ACCESS_TOKEN_EXPIRED_IN, REFRESH_TOKEN_EXPIRED_IN } = process.env;

    const accessToken = encodeJwt({ id: user.user_id }, ACCESS_TOKEN_EXPIRED_IN || '5m', 'access');
    const newRefreshToken = encodeJwt({ id: user.user_id }, REFRESH_TOKEN_EXPIRED_IN || '30d', 'refresh');

    // update refresh token
    const updateSet : any = {
      refresh_token : newRefreshToken
    }
    await updateUserFields(user.id , updateSet);

    res.status(200).json({ accessToken, refreshToken: newRefreshToken });
  } catch (err: any) {
    logger.error(err);
    next(err);
  }
};
