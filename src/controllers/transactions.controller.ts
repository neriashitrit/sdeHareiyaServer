import { Request, Response } from 'express';

import {
  transactionModel,
  transactionSideModel,
  commissionModel,
  userAccountModel,
  userModel,
  accountModel,
  transactionStageModel,
  transactionProductPropertyModel,
} from '../models/index';

import _ from 'lodash';
import { failureResponse, successResponse } from '../utils/response';
import transactionHelper from '../helpers/transaction.helper';
import { commissionCalculate } from '../utils/helperFunctions';
import {
  TransactionSide,
  TransactionStageStatus,
  IUser,
  TransactionStageName,
  TransactionStatus,
  AccountType,
} from 'safe-shore-common';
import {
  isCreateTransactionBody,
  isUpdateTransactionBody,
} from '../utils/typeCheckers.utils';
import { ITransactionProductProperty } from 'safe-shore-common/dist/models';

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
      productProperties,
    } = body;

    const commissionObject = await getCommissionByAmount(amount);

    const transaction = await transactionModel.createTransaction({
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

    const transactionStage = await transactionStageModel.createTransactionStage(
      {
        name: TransactionStageName.Draft,
        transactionId: transaction.id,
        inCharge: TransactionSide.SideA,
        status: TransactionStageStatus.Active,
      }
    );

    const transactionProductProperties = await upsertProductProperties(
      transaction.id,
      productProperties
    );

    const userAccount = await userAccountModel.getUserAccount({
      userId: user.id,
    });

    const transactionSide = await transactionSideModel.createTransactionSide({
      transactionId: transaction.id,
      userAccountId: userAccount.id,
      side: TransactionSide.SideA,
    });

    transaction.sides = [transactionSide];
    transaction.stages = [transactionStage!];
    transaction.properties = transactionProductProperties;
    //  TODO add commission
    return res.status(200).json(successResponse(transaction));
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
      completed,
      productCategoryId,
      productCategoryOther,
      productSubcategoryId,
      productSubcategoryOther,
      currency,
      amount,
      productProperties,
      endDate,
      commissionPayer,
      creatorSide,
      firstName,
      lastName,
      phoneNumber,
      email,
    } = body;

    //  Check user is one of the sides of the transaction
    const transaction = await transactionModel.getTransaction({
      id: transactionId,
      'user.id': user.id,
    });

    if (!transaction) {
      return res
        .status(400)
        .send(failureResponse('cant update this transaction'));
    }

    //  Check the active stage of the transaction
    const activeStage = await transactionStageModel.getTransactionStage({
      transaction_id: transactionId,
      status: TransactionStageStatus.Active,
    });

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

    if (productProperties) {
      const transactionProductProperties = await upsertProductProperties(
        transaction.id,
        productProperties
      );
    }

    if (
      !_.isNil(firstName) ||
      !_.isNil(lastName) ||
      !_.isNil(email) ||
      !_.isNil(phoneNumber)
    ) {
      const transactionSideB = await transactionSideModel.getTransactionSide(
        `transaction_id = id AND user.id != ${user.id}`
      );

      if (transactionSideB) {
        if (transactionSideB.user.isActivated) {
          return res
            .status(400)
            .json(failureResponse('cant update already activated user'));
        }
        userModel.updateUser(
          { firstName, lastName, email, phoneNumber },
          { id: transactionSideB.user.id }
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

        let userAccount = await userAccountModel.getUserAccount({
          'u.email': email,
        });

        if (userAccount) {
          if (userAccount.user.isActivated) {
            return res
              .status(400)
              .json(failureResponse('cant update already activated user'));
          }
          //  update user if not active (means we created him)
          await userModel.updateUser(
            {
              firstName: firstName,
              lastName: lastName,
              phoneNumber: phoneNumber,
              lastActiveAt: new Date(),
            },
            {
              email: email,
            }
          );

          await transactionSideModel.updateTransactionSide(
            {
              userAccountId: userAccount.id,
              transactionId: transactionId,
            },
            {
              side:
                creatorSide === TransactionSide.Buyer
                  ? TransactionSide.Seller
                  : TransactionSide.Seller,
            }
          );
        } else {
          //  create user account
          const newUser = await userModel.createUser({
            firstName: firstName,
            lastName: lastName,
            email: email,
            phoneNumber: phoneNumber,
            lastActiveAt: new Date(),
            isActive: false,
          });

          const newAccount = await accountModel.createAccount({
            type: AccountType.Private,
          });

          userAccount = await userAccountModel.createUserAccount({
            userId: newUser.id,
            accountId: newAccount.id,
          });

          await transactionSideModel.createTransactionSide({
            userAccountId: userAccount.id,
            transactionId: transactionId,
            side:
              creatorSide === TransactionSide.Buyer
                ? TransactionSide.Seller
                : TransactionSide.Seller,
          });
        }
      }
    }

    const updatedTransaction = await transactionModel.updateTransaction(
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
        creatorSide,
        ...updatedFields,
      }
    );

    if (
      completed
      //  TODO check if actually completed
      //  1. all neccessary transaction props
      //  2. 2 transaction sides
      //  3. check product props exist
    ) {
      await transactionHelper.nextStage(user.id, transactionId);
    }

    return res.status(200).json(successResponse(updatedTransaction));
  } catch (error) {
    console.error(
      'ERROR in transactions.controller createTransaction()',
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
  productProperties: ITransactionProductProperty[]
): Promise<ITransactionProductProperty[]> => {
  const transactionProductProperties: ITransactionProductProperty[] = [];
  for (const property of productProperties) {
    const transactionProductProperty =
      await transactionProductPropertyModel.getTransactionProductProperty({
        id: property.id,
      });
    if (transactionProductProperty) {
      transactionProductProperties.push(
        await transactionProductPropertyModel.updateTransactionProductProperty(
          {
            value: property.value,
            // TODO files
          },
          { transactionId, productPropertyId: property.id }
        )
      );
    } else {
      transactionProductProperties.push(
        await transactionProductPropertyModel.createTransactionProductProperty({
          transactionId,
          productPropertyId: property.id,
          value: property.value,
          // TODO files
        })
      );
    }
  }
  return transactionProductProperties;
};
