import { Schema } from 'express-validator';
import { VALIDATION_STRING , VALIDATION_EMAIL_NOT_EXIST , VALIDATION_PASSWORD , VALIDATION_ACCOUNT_TEL , VALIDATION_TOKEN} from '../../../constants/validation';

export const REGISTER_SCHEMA: Schema = {
  email: VALIDATION_EMAIL_NOT_EXIST('body'),
  password: VALIDATION_PASSWORD('body'),
  name: VALIDATION_STRING('body'),
  phone: VALIDATION_ACCOUNT_TEL('body'),
  address: VALIDATION_STRING('body'),
};

export const LOGIN_SCHEMA: Schema = {
  email: VALIDATION_EMAIL_NOT_EXIST('body'),
  password: VALIDATION_PASSWORD('body'),
};

export const FORGOT_PASSWORD_SCHEMA: Schema = {
  email: VALIDATION_EMAIL_NOT_EXIST('body'),
};

export const UPDATE_PASSWORD_SCHEMA: Schema = {
    password: VALIDATION_PASSWORD('body'),
    tokenId: VALIDATION_TOKEN('body'),
};

export const REFRESH_TOKEN_SCHEMA: Schema = {
  refreshToken: VALIDATION_STRING('body'),
};
