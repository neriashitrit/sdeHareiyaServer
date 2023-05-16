import { Request, Response } from 'express';

import { userModel } from '../../models/index';

import { failureResponse, successResponse } from '../../utils/db.utils';

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
  try {
    const user = await userModel.getUserById(Number(userId));
    console.log(user);
    res.status(200).json(successResponse(user));
  } catch (error: any) {
    console.log(error);
    res.status(500).json(failureResponse(error));
  }
};
