import { Request, Response } from 'express';

import { userModel } from '../../models/index';
import { createAdminUserInB2C } from '../../services/activeDirectory.service'
import { failureResponse, successResponse } from '../../utils/db.utils';
import usersHelper from '../../helpers/users.helper';

export const getAllUsers = async (req: Request, res: Response) => {
  console.log('in controller getUser');
  try {
    const users = await userModel.getAllUsers();
    console.log(users);
    res.status(200).json(successResponse(users));
  } catch (error: any) {
    console.log(error);
    res.status(500).json(failureResponse(error));
  }
};

export const getUserById = async (req: Request, res: Response) => {
  console.log('in controller getUserById');
  const { userId } = req.body;
  if (!userId) return res.status(400).json(failureResponse('missing Params'));
  try {
    const user = await userModel.getUserById(Number(userId));
    console.log(user);
    res.status(200).json(successResponse(user));
  } catch (error: any) {
    console.log(error);
    res.status(500).json(failureResponse(error));
  }
};

export const createAdminUser = async (req: Request, res: Response) => {
  console.log('in controller createAdminUser');
  const {firstName, lastName, email, phone} = req.body;
  if (!firstName || !lastName || !email || !phone) return res.status(400).json(failureResponse('missing Params'));
  try {
    const ADUser = await createAdminUserInB2C(firstName, lastName, email, phone);
    const user  =  await usersHelper.createAdminUserFromADRespond(ADUser)
    res.status(200).json(successResponse(user));
  } catch (error: any) {
    console.log(error);
    res.status(500).json(failureResponse(error));
  }
};