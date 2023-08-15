import { ParamSchema, Location } from 'express-validator';

export const VALIDATION_STRING = (where: Location): ParamSchema => ({
  in: [where],
  isString: true,
  notEmpty: true,
});

export const VALIDATION_EMAIL_NOT_EXIST = (where : Location) : ParamSchema => ({
  in: [where],
  isString: true,
  notEmpty: true,
  isEmail : {bail : true}
})

export const VALIDATION_PASSWORD = (where : Location) : ParamSchema => ({
  in: [where],
  isString: true,
  notEmpty: true,
  isLength: { options: { min: 6, max: 50 } , errorMessage : "Password should be between 6-50 characters" },
})

export const VALIDATION_ACCOUNT_TEL = (where : Location) : ParamSchema => ({
  in: [where],
  isString: true,
  notEmpty: true, 
  isMobilePhone : {errorMessage : "Please enter a valid format of phone number"}
})

export const VALIDATION_TOKEN = VALIDATION_STRING;