import { Request, Response } from 'express';

import { failureResponse, successResponse } from '../utils/db.utils';
import { IUser } from 'safe-shore-common';
import {
  isAccountAuthorizationCompanyBody,
  isAccountAuthorizationPrivateBody,
} from '../utils/typeCheckers.utils';
import accountHelper from '../helpers/account.helper';
import transactionStageHelper from '../helpers/transactionStage.helper';
import transactionHelper from '../helpers/transaction.helper';
import transactionSideHelper from '../helpers/transactionSide.helper';
import { accountModel } from '../models';
import { Tables } from '../constants';

export const submitAccountAuthorization = async (
  req: Request,
  res: Response
) => {
  try {
    const user = req.user as IUser;
    const body = req.body;

    let result: boolean;
    if (isAccountAuthorizationPrivateBody(body)) {
      result = await accountHelper.privateAccountAuthorization(user.id, body);
    } else if (isAccountAuthorizationCompanyBody(body)) {
      result = await accountHelper.companyAccountAuthorization(user.id, body);
    } else {
      return res.status(400).json(failureResponse('Invalid Parameters'));
    }

    if (!result) {
      return res
        .status(400)
        .json(
          failureResponse('Cant submit authorization form for this account')
        );
    }

    const pendingAuthTransactions =
      await transactionHelper.getPendingAuthTransactions(user.id);

    for (const transaction of pendingAuthTransactions) {
      let [transactionCurrentSide] =
        await transactionSideHelper.getTransactionSides(
          transaction.id,
          user.id
        );

      const activeStage = (
        await transactionStageHelper.getActiveStage(transaction.id)
      )[0];

      if (!transactionCurrentSide) {
        throw Error(
          'transactionCurrentSide in accountAuthorization.controller is undefined'
        );
      }

      transactionStageHelper.nextStage(
        transaction.id,
        transactionCurrentSide,
        activeStage
      );
    }

    return res.status(200).json(successResponse());
  } catch (error) {
    return res.status(500).json(failureResponse(error));
  }
};

export const getAccount = async (req: Request, res: Response) => {
  const user = req.user as IUser;

  try {
    const account = await accountModel.getAccount({
      [`${Tables.USERS}.id`]: user.id,
    });
    res.status(200).json(successResponse(account[0]));
  } catch (error: any) {
    console.log(error);
    res.status(500).json(failureResponse(error));
  }
};
