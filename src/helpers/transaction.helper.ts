import {
  ITransactionSide,
  ITransactionStage,
  TransactionStageName,
  TransactionStageStatus,
  TransactionSide,
} from 'safe-shore-common';
import {
  transactionStageModel,
  transactionModel,
  transactionSideModel,
} from '../models/index';
import _ from 'lodash';
import {
  transactionStagePossiblePaths,
  transactionStageInCharge,
} from '../constants';

const transactionHelper = {
  nextStage: async (
    userId: number,
    transactionId: number,
    additionalData?: Record<string, any>
  ): Promise<ITransactionStage | undefined> => {
    try {
      const requestingUser: ITransactionSide =
        await transactionSideModel.getTransactionSide({
          'ua.user_id': userId,
        });

      const activeStage = await transactionStageModel.getTransactionStage({
        transactionId,
        status: TransactionStageStatus.Active,
      });

      if (_.isNil(activeStage)) {
        return setDefaultStage(transactionId, userId);
      }

      if (activeStage.inCharge !== requestingUser.side || !requestingUser) {
        //  TODO handle as bad request 400
        return;
      }

      const nextStages = transactionStagePossiblePaths[activeStage.name];

      setPreviousStageCompleted(transactionId, activeStage);

      if (nextStages.length === 1) {
        return setNextStage(transactionId, userId, nextStages, additionalData);
      } else if (nextStages.length > 1) {
        return setMultiChoiceStage(
          activeStage.name,
          requestingUser,
          transactionId,
          userId,
          nextStages,
          additionalData
        );
      }
      //  TODO handle as internal error 500
      throw 'error!';
    } catch (error) {
      console.error('ERROR in transaction.helper nextStage()', error.message);
      throw {
        message: `error while trying to next stage. error: ${error.message}`,
      };
    }
  },
};

const setPreviousStageCompleted = async (
  transactionId: number,
  activeStage: ITransactionStage,
  additionalData?: Record<string, any>
) => {
  await transactionStageModel.updateTransactionStage(
    { transactionId, name: activeStage.name },
    { status: TransactionStageStatus.Completed, additionalData }
  );
};
//  sets one choice next stage
const setNextStage = async (
  transactionId: number,
  userId: number,
  nextStages: TransactionStageName[],
  additionalData?: Record<string, any> | undefined
) => {
  return await transactionStageModel.createTransactionStage({
    transactionId,
    name: nextStages[0],
    status: TransactionStageStatus.Active,
    additionalData,
    userId,
    inCharge: transactionStageInCharge[nextStages[0]],
  });
};
//  sets default stage = DraftS1
const setDefaultStage = async (
  transactionId: number,
  userId: number,
  additionalData?: Record<string, any> | undefined
) => {
  return await transactionStageModel.createTransactionStage({
    transactionId,
    name: TransactionStageName.Draft,
    status: TransactionStageStatus.Active,
    inCharge: TransactionSide.SideA,
    userId,
    additionalData,
  });
};
//  sets multi choice next stage with logic
const setMultiChoiceStage = async (
  activeStageName: string,
  requester: ITransactionSide,
  transactionId: number,
  userId: number,
  nextStages: TransactionStageName[],
  additionalData?: Record<string, any>
) => {
  switch (activeStageName) {
    case TransactionStageName.Draft:
      const sum = await transactionModel.getTransactionsAmountSumLastHalfYear(
        requester.account.id
      );
      if (sum <= 50000) {
        return await transactionStageModel.createTransactionStage({
          transactionId,
          name: nextStages[1],
          status: TransactionStageStatus.Active,
          additionalData,
          userId,
          inCharge: transactionStageInCharge[nextStages[1]],
        });
      } else {
        return await transactionStageModel.createTransactionStage({
          transactionId,
          name: nextStages[0],
          status: TransactionStageStatus.Active,
          additionalData,
          userId,
          inCharge: transactionStageInCharge[nextStages[0]],
        });
      }
    default:
      throw 'error!';
  }
};

export default transactionHelper;
