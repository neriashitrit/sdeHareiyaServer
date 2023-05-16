import { Request, Response } from 'express';
import _ from 'lodash';

import { accountModel } from '../../models/index';

import { successResponse, failureResponse } from '../../utils/db.utils';
import { Tables } from '../../constants';

export const getAllAccounts = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.body;
    const accounts = await accountModel.getAllAccounts(startDate, endDate);
    res.status(200).json(successResponse(accounts));
  } catch (error: any) {
    res.status(500).json(failureResponse(error));
  }
};

export const getAccountById = async (req: Request, res: Response) => {
  const { accountId } = req.body;
  try {
    const account = await accountModel.getAccount({
      [`${Tables.ACCOUNTS}.id`]: accountId,
    });
    if (_.isEmpty(account)) {
      return res
        .status(400)
        .json(failureResponse('No transaction with this id'));
    }
    return res.status(200).json(successResponse(account[0]));
  } catch (error: any) {
    return res.status(500).json(failureResponse(error));
  }
};
