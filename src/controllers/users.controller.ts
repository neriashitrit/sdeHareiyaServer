import { Request, Response } from 'express';

import { userModel, accountModel, userAccountModel } from '../models/index';

import { AuthInfo } from 'types';
import usersHelper from '../helpers/users.helper';
import { failureResponse, successResponse } from '../utils/response';

export const userLogin = async (req: Request, res: Response) => {
  //  TODO make it as transaction structure
  console.log('in controller userLogin');
  const authInfo: AuthInfo = req?.authInfo as AuthInfo;
  const userMail = authInfo.emails[0];
  const accountType = authInfo.extension_account_type ?? 'private';

  try {
    const user = await userModel.getUser(userMail);
    if (!user) {
      const newUser = await usersHelper.createUser(authInfo);
      const newAccount = await accountModel.createAccount({
        type: accountType,
      });
      const newUserAccount = await userAccountModel.createUserAccount({
        userId: newUser.id,
        accountId: newAccount.id,
      });

      return res.status(200).json(successResponse(newUser));
    } else return res.status(200).json(successResponse(user));
  } catch (error) {
    console.error('ERROR in users.controller userLogin()', error.message);
    return res
      .status(400)
      .send({ message: 'Something went wrong', error: error.message });
  }
};

export const getAllUsers =  async (req: Request, res: Response) => {
  console.log('in controller getUser');
  try {
    const users = await userModel.getAllUsers();
    console.log(users)
    res.status(200).json(successResponse(users))
	} catch (error: any) {
		console.log(error);
		res.status(500).json(failureResponse(error))
	}
}

export const getUserById =  async (req: Request, res: Response) => {
  console.log('in controller getUserById');
  const { userId } = req.body;
  try {
    const user = await userModel.getUserById(Number(userId));
    console.log(user)
    res.status(200).json(successResponse(user))
	} catch (error: any) {
		console.log(error);
		res.status(500).json(failureResponse(error))
	}
}