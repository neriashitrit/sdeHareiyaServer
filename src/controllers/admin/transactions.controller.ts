import { Request, Response } from 'express';

import {
  transactionModel,
} from '../../models/transactions.model';

import _ from 'lodash';
import { failureResponse, successResponse } from '../../utils/db.utils';

export const getTransactionsStatusAnalytics = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.body;   
    const analytics = await transactionModel.getTransactionsStatusAnalytics(startDate, endDate);
    res.status(200).json(successResponse(analytics))
	} catch (error: any) {
		console.log(error);
    res.status(500).json(failureResponse(error))
	}
}

export const getTransactionsProductsAnalytics = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.body;   
    const analytics = await transactionModel.getTransactionsProductsAnalytics(startDate, endDate);
    res.status(200).json(successResponse(analytics))
	} catch (error: any) {
		console.log(error);
    res.status(500).json(failureResponse(error))
	}
}
