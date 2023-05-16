import { Request, Response } from 'express';

import { transactionModel } from '../../models/transactions.model';

import _ from 'lodash';
import { buildConditionString, buildRange, failureResponse, successResponse } from '../../utils/db.utils';
import { isAdminApproveStageBody } from '../../utils/typeCheckers.utils';
import transactionStageHelper from '../../helpers/transactionStage.helper';
import { IUser } from 'safe-shore-common';
import DbService from '../../services/db.service';
import { transactionSideModel } from '../../models';
import transactionHelper from '../../helpers/transaction.helper';
import { TransactionSide, TransactionStageStatus, TransactionStatus } from 'safe-shore-common';
import { conditionForTransactionsNeedAutorization } from '../../constants';

export const getAllTransactions = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.body;
    const condition = buildConditionString([
      {
        column:'t.updated_at',
        operator:'>=',
        value:startDate
      },
      {
        column:'t.updated_at',
        operator:'<=',
        value:endDate
      }
    ])
    const transactions = await transactionHelper.getTransactions({ condition});
    res.status(200).json(successResponse(transactions))
	} catch (error: any) {
		console.log(error);
    res.status(500).json(failureResponse(error))
	}
}

export const getTransactionById = async (req: Request, res: Response) => {
  try {
    const { transactionId } = req.params;
    const condition = buildConditionString([
      {
        column:'t.id',
        value:transactionId
      }
    ])
    const transaction = await transactionHelper.getTransactions({ condition});

    if (_.isEmpty(transaction)) {
      return res
        .status(400)
        .json(failureResponse('No transaction with this id'));
    }
    res.status(200).json(successResponse(transaction[0]))
	} catch (error: any) {
		console.log(error);
    res.status(500).json(failureResponse(error))
	}
}

export const getAutorizeTransactions = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.body;
    const condition = buildConditionString([
      {
        column:'t.updated_at',
        operator:'>=',
        value:startDate
      },
      {
        column:'t.updated_at',
        operator:'<=',
        value:endDate
      },
      ...conditionForTransactionsNeedAutorization
    ])
    const transactions = await transactionHelper.getTransactions({ condition});
    res.status(200).json(successResponse(transactions))
	} catch (error: any) {
		console.log(error);
    res.status(500).json(failureResponse(error))
	}
}

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
