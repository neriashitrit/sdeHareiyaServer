import { Request, Response } from 'express';

import {
  transactionModel,
  commissionModel,
  transactionStageModel,
  transactionProductPropertyModel,
} from '../models/index';

import _ from 'lodash';
import transactionHelper from '../helpers/transaction.helper';
import { commissionCalculate } from '../utils/global.utils';
import { failureResponse, successResponse } from '../utils/db.utils';

import {
  TransactionSide,
  TransactionStageStatus,
  IUser,
  TransactionStageName,
  TransactionStatus,
  ITransactionSide,
} from 'safe-shore-common';
import {
  isApproveStageBody,
  isCreateTransactionBody,
  isGetTransactionParams,
  isUpdateTransactionBody,
} from '../utils/typeCheckers.utils';

import { CreateTransactionBodyProductProperty } from 'types/requestBody.types';
import transactionSideHelper from '../helpers/transactionSide.helper';
import transactionStageHelper from '../helpers/transactionStage.helper';

export const getTransactions = async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser;

    const transactions = await transactionHelper.getTransactions({
      userId: user.id,
    });

    return res.status(200).json(successResponse(transactions));
  } catch (error) {
    console.error(
      'ERROR in transactions.controller getTransactions()',
      error.message
    );
    return res.status(500).json(failureResponse(error.message));
  }
};

export const getTransaction = async (req: Request, res: Response) => {
  try {
    const params = req.params;

    if (!isGetTransactionParams(params)) {
      return res.status(400).json(failureResponse('Invalid Parameters'));
    }

    const { transactionId } = params;

    const responseTransaction = await transactionHelper.getTransaction({
      transactionId,
    });

    if (_.isNull(responseTransaction)) {
      return res
        .status(400)
        .json(failureResponse('No transaction with this id'));
    }

    return res.status(200).json(successResponse(responseTransaction));
  } catch (error) {
    console.error(
      'ERROR in transactions.controller getTransaction()',
      error.message
    );
    return res.status(500).send(failureResponse(error.message));
  }
};

export const createTransaction = async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser;
    const body = req.body;

    if (!isCreateTransactionBody(body)) {
      return res.status(400).json(failureResponse('Invalid Parameters'));
    }

    const {
      productCategoryId,
      productCategoryOther,
      productSubcategoryId,
      productSubcategoryOther,
      currency,
      amount,
      properties,
    } = body;

    const commissionObject = await getCommissionByAmount(amount);

    const newTransaction = await transactionModel.createTransaction({
      status: TransactionStatus.Stage,
      productCategoryId,
      productCategoryOther,
      productSubcategoryId,
      productSubcategoryOther,
      amountCurrency: currency,
      amount,
      commissionId: commissionObject.commissionId,
      commissionAmountCurrency: currency,
      commissionAmount: commissionObject.amount,
    });

    if (!newTransaction) {
      return res
        .status(400)
        .json(failureResponse('Couldn`t create new transaction'));
    }

    const transactionStage = await transactionStageModel.createTransactionStage(
      {
        name: TransactionStageName.Draft,
        transactionId: newTransaction.id,
        inCharge: TransactionSide.SideA,
        status: TransactionStageStatus.Active,
        userId: user.id,
      }
    );

    await upsertProductProperties(newTransaction.id, properties);

    const transactionSides = await transactionSideHelper.createTransactionSideA(
      newTransaction.id,
      user.id
    );

    const responseTransaction = await transactionHelper.getTransaction({
      transactionId: newTransaction.id,
      sides: transactionSides,
      stages: transactionStage ? [transactionStage] : [],
      disputes: [],
    });

    if (_.isNull(responseTransaction)) {
      throw `Could not find created transaction with id ${newTransaction.id}`;
    }

    return res.status(200).json(successResponse(responseTransaction));
  } catch (error) {
    console.error(
      'ERROR in transactions.controller createTransaction()',
      error.message
    );
    return res.status(500).send(failureResponse(error.message));
  }
};

export const updateTransaction = async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser;
    const body = req.body;

    if (!isUpdateTransactionBody(body)) {
      return res.status(400).json(failureResponse('Invalid Parameters'));
    }

    const {
      transactionId,
      productCategoryId,
      productCategoryOther,
      productSubcategoryId,
      productSubcategoryOther,
      currency,
      amount,
      properties,
      endDate,
      commissionPayer,
      creatorSide,
      firstName,
      lastName,
      phoneNumber,
      email,
    } = body;

    //  Check user is one of the sides of the transaction
    let [transactionCurrentSide, transactionOtherSide] =
      await transactionSideHelper.getTransactionSides(transactionId, user.id);

    if (!transactionCurrentSide) {
      return res
        .status(400)
        .send(failureResponse('cant update this transaction'));
    }

    const activeStage = (
      await transactionStageHelper.getActiveStage(transactionId)
    )[0];

    if (
      _.isNil(activeStage) ||
      (activeStage.name !== TransactionStageName.AuthorizationSideA &&
        activeStage.name !== TransactionStageName.Draft)
    ) {
      return res
        .status(400)
        .send(
          failureResponse(`cant edit transaction at ${activeStage?.name} stage`)
        );
    }

    const updatedFields: Record<string, any> = {};

    if (amount) {
      const commissionObject = await getCommissionByAmount(amount);

      updatedFields.amount = amount;
      updatedFields.commissionId = commissionObject.commissionId;
      updatedFields.commissionAmount = commissionObject.amount;
    }

    if (properties) {
      await upsertProductProperties(transactionId, properties);
    }

    let transactionSides: ITransactionSide[] | null = null;
    if (firstName || lastName || email || phoneNumber || creatorSide) {
      if (transactionOtherSide) {
        transactionSides = await transactionSideHelper.updateTransactionSideB(
          transactionId,
          user,
          transactionOtherSide.user,
          firstName,
          lastName,
          email,
          phoneNumber,
          creatorSide
        );
      } else {
        if (
          _.isNil(firstName) ||
          _.isNil(lastName) ||
          _.isNil(email) ||
          _.isNil(phoneNumber) ||
          _.isNil(creatorSide)
        ) {
          return res
            .status(400)
            .json(
              failureResponse(
                'one of these parameters firstName, lastName, email, phoneNumber, creatorSide are missing'
              )
            );
        }

        transactionSides = await transactionSideHelper.createTransactionSideB(
          transactionId,
          user.id,
          firstName,
          lastName,
          email,
          phoneNumber,
          creatorSide
        );
      }
    }
    if (
      !_.isNil(productCategoryId) ||
      !_.isNil(productCategoryOther) ||
      !_.isNil(productSubcategoryId) ||
      !_.isNil(productSubcategoryOther) ||
      !_.isNil(currency) ||
      !_.isNil(endDate) ||
      !_.isNil(commissionPayer) ||
      !_.isNil(productCategoryId) ||
      Object.keys(updatedFields).length !== 0
    ) {
      await transactionModel.updateTransaction(
        { id: transactionId },
        {
          productCategoryId,
          productCategoryOther,
          productSubcategoryId,
          productSubcategoryOther,
          amountCurrency: currency,
          commissionAmountCurrency: currency,
          endDate,
          commissionPayer,
          ...updatedFields,
        }
      );
    }

    const responseTransaction = await transactionHelper.getTransaction({
      transactionId,
      sides:
        transactionSides ??
        (transactionOtherSide !== undefined
          ? [transactionCurrentSide, transactionOtherSide]
          : [transactionCurrentSide]),
    });

    if (_.isNull(responseTransaction)) {
      throw `Could not find updated transaction with id ${transactionId}`;
    }

    return res.status(200).json(successResponse(responseTransaction));
  } catch (error) {
    console.error(
      'ERROR in transactions.controller updateTransaction()',
      error.message
    );
    return res.status(500).send(failureResponse(error.message));
  }
};

export const approveStage = async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser;
    const body = {
      ...req.body,
      // depositReferenceFile: req.files?.depositReferenceFile,
    };

    if (!isApproveStageBody(body)) {
      return res.status(400).json(failureResponse('Invalid Parameters'));
    }

    const {
      transactionId,
      depositBankName,
      depositBankNumber,
      depositBankAccountOwnerFullName,
      depositTransferDate,
      depositReferenceNumber,
      // depositReferenceFile,
      deliveryDate,
      deliveryType,
      deliveryNotes,
    } = body;

    const [transactionCurrentSide, transactionOtherSide] =
      await transactionSideHelper.getTransactionSides(transactionId, user.id);

    const activeStage = (
      await transactionStageHelper.getActiveStage(transactionId)
    )[0];

    if (
      activeStage.inCharge !== transactionCurrentSide?.side &&
      !(
        activeStage.inCharge === TransactionSide.SideA &&
        transactionCurrentSide?.isCreator
      ) &&
      !(
        activeStage.inCharge === TransactionSide.SideB &&
        !transactionCurrentSide?.isCreator
      )
    ) {
      return res
        .status(400)
        .json(failureResponse('Current user is not in charge of this stage'));
    }

    if (!transactionCurrentSide || !transactionOtherSide) {
      throw 'transactionCurrentSide or transactionOtherSide are undefined in transactions.controller approveStage() ';
    }

    const { success, additionalData, transactionProps, errorMessage } =
      await transactionStageHelper.isStageCompleted(
        transactionId,
        activeStage,
        transactionCurrentSide,
        transactionOtherSide,
        depositBankName,
        depositBankNumber,
        depositBankAccountOwnerFullName,
        depositTransferDate,
        depositReferenceNumber,
        // depositReferenceFile,
        deliveryDate,
        deliveryType,
        deliveryNotes
      );

    if (!success) {
      return res.status(400).json(failureResponse(errorMessage));
    }

    const nextStage = await transactionStageHelper.nextStage(
      transactionId,
      transactionCurrentSide!,
      activeStage,
      transactionProps,
      additionalData
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

const getCommissionByAmount = async (
  amount: number
): Promise<{ commissionId: number | null; amount: number }> => {
  const commissions = await commissionModel.getCommissions({
    isActive: true,
  });

  return commissionCalculate(commissions, amount);
};

const upsertProductProperties = async (
  transactionId: number,
  properties: CreateTransactionBodyProductProperty[]
): Promise<void> => {
  for (const property of properties) {
    const transactionProductProperty =
      await transactionProductPropertyModel.getTransactionProductProperty({
        'pp.id': property.productPropertyId,
        'tpp.transaction_id': transactionId,
      });
    if (transactionProductProperty) {
      await transactionProductPropertyModel.updateTransactionProductProperty(
        {
          value: property.value,
          // TODO files
        },
        {
          id: transactionProductProperty.id,
        }
      );
      continue;
    }
    await transactionProductPropertyModel.createTransactionProductProperty({
      transactionId,
      productPropertyId: property.productPropertyId,
      value: property.value,
      // TODO files
    });
  }
};
