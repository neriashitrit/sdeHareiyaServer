import { Request, Response } from 'express';

import { transactionModel } from '../../models/transactions.model';

import _ from 'lodash';
import { failureResponse, successResponse } from '../../utils/db.utils';
import { isAdminApproveStageBody } from '../../utils/typeCheckers.utils';
import transactionStageHelper from '../../helpers/transactionStage.helper';
import { IUser, TransactionSide } from 'safe-shore-common';

export const getTransactionsStatusAnalytics = async (
  req: Request,
  res: Response
) => {
  try {
    const { startDate, endDate } = req.body;
    const analytics = await transactionModel.getTransactionsStatusAnalytics(
      startDate,
      endDate
    );
    res.status(200).json(successResponse(analytics));
  } catch (error: any) {
    console.log(error);
    res.status(500).json(failureResponse(error));
  }
};

export const getTransactionsProductsAnalytics = async (
  req: Request,
  res: Response
) => {
  try {
    const { startDate, endDate } = req.body;
    const analytics = await transactionModel.getTransactionsProductsAnalytics(
      startDate,
      endDate
    );
    res.status(200).json(successResponse(analytics));
  } catch (error: any) {
    console.log(error);
    res.status(500).json(failureResponse(error));
  }
};

export const approveStage = async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser;
    const body = req.body;

    if (!isAdminApproveStageBody(body)) {
      return res.status(400).json(failureResponse('Invalid Parameters'));
    }

    const { transactionId } = body;

    const activeStage = (
      await transactionStageHelper.getActiveStage(transactionId)
    )[0];

    if (!activeStage || activeStage.inCharge !== TransactionSide.Admin) {
      return res
        .status(400)
        .json(failureResponse('Admin is not in charge of this stage'));
    }

    const nextStage = await transactionStageHelper.adminNextStage(
      transactionId,
      user.id,
      activeStage
    );

    return res.status(200).json(successResponse(nextStage!));
  } catch (error) {
    console.error(
      'ERROR in transactions.controller approveStage()',
      error.message
    );
    return res.status(500).send(failureResponse(error.message));
  }
};
