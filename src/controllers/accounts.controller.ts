import { Request, Response } from 'express';

import { accountModel, userAccountModel } from '../models/index';

import { successResponse,failureResponse } from '../utils/response';

export const getAllAccounts =  async (req: Request, res: Response) => {
  console.log('in controller getAllAccounts');
  try {
    const { startDate, endDate } = req.body;   
    const accounts = await accountModel.getAllAccounts(startDate, endDate);
    res.status(201).json(successResponse(accounts))
	} catch (error: any) {
		console.log(error);
    res.status(500).json(failureResponse(error))
	}
}

export const getAccountById =  async (req: Request, res: Response) => {
  console.log('in controller getAccountById');
  const { accountId } = req.body;
  try {
    const account = await accountModel.getAccount({ 'accounts.id': accountId });  
    res.status(201).json(successResponse(account))
	} catch (error: any) {
		console.log(error);
		res.status(500).json(failureResponse(error))
	}
}
