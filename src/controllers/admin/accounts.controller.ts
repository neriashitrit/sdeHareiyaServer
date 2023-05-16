import { Request, Response } from 'express';
import _ from 'lodash';

import { accountModel } from '../../models/index';

import { successResponse, failureResponse } from '../../utils/db.utils';

export const getAllAccounts = async (req: Request, res: Response) => {
  console.log('in controller getAllAccounts');
  try {
    const { startDate, endDate } = req.body;
    const accounts = await accountModel.getAllAccounts(startDate, endDate);
    res.status(200).json(successResponse(accounts))
	} catch (error: any) {
		console.log(error);
    res.status(500).json(failureResponse(error))
	}
}

export const getAccountById = async (req: Request, res: Response) => {
  console.log('in controller getAccountById');
  const { accountId } = req.params;
  try {
    const account = await accountModel.getAccount({ 'accounts.id': accountId });
    if (_.isEmpty(account)) {
      return res
        .status(400)
        .json(failureResponse('No transaction with this id'));
    }
    res.status(200).json(successResponse(account[0]))
	} catch (error: any) {
		console.log(error);
		res.status(500).json(failureResponse(error))
	}
}
