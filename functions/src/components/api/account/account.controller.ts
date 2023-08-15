import { Request, Response, NextFunction } from 'express';
import { getUserById } from '../../../models/user';
import { logger } from 'firebase-functions/v1';
import { badImplementationException } from '../../../utils/apiErrorHandler';
import { updateUserFields } from '../../../models/user';

export const updateAccount = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } : any = req.user;
        await updateUserFields(userId , req.body);
        res.status(200).json();
    } catch (error) {
        logger.log(error);
        throw badImplementationException("Something went wrong in updating account info"); 
    }
};

export const updatePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await updateAccount(req, res , next);
        res.status(200).json();
    } catch (error) {
        logger.log(error);
        throw badImplementationException("Something went wrong in updating account info"); 
    }
};

export const getAccountInfo = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const { user_id } : any = req.user;
        let accountDetails = await getUserById(user_id);
        res.status(200).json(accountDetails);

    } catch (error) {
        logger.log(error);
        throw badImplementationException("Something went wrong in fetching account info");   
    }    

};
