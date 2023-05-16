import {
  AuthorizationStatus,
  ITransactionSide,
  ITransactionStage,
  TransactionStageName,
  TransactionStageStatus,
  TransactionSide,
  TransactionStatus,
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
  Tables,
} from '../constants';
import transactionHelper from './transaction.helper';
import fileHelper from './file.helper';

const transactionStageHelper = {
  adminNextStage: async (
    transactionId: number,
    userId: number,
    activeStage: ITransactionStage
  ) => {
    try {
      const nextStages = transactionStagePossiblePaths[activeStage.name];

      await setPreviousStageCompleted(transactionId, activeStage.id, userId);

      return createNextStage(transactionId, nextStages);
    } catch (error) {
      console.error('ERROR in transaction.helper nextStage()', error.message);
      throw {
        message: `error while trying to next stage. error: ${error.message}`,
      };
    }
  },
  nextStage: async (
    transactionId: number,
    requestingSide: ITransactionSide,
    activeStage: ITransactionStage,
    transactionProps?: Record<string, any>,
    additionalData?: Record<string, any>
  ): Promise<ITransactionStage | undefined> => {
    try {
      const nextStages = transactionStagePossiblePaths[activeStage.name];

      await setPreviousStageCompleted(
        transactionId,
        activeStage.id,
        requestingSide.user.id,
        transactionProps,
        additionalData
      );

      if (nextStages.length === 1) {
        return createNextStage(transactionId, nextStages);
      } else if (nextStages.length > 1) {
        return createNextStageFromMultiChoice(
          activeStage.name,
          requestingSide,
          transactionId,
          nextStages
        );
      }
      return;
    } catch (error) {
      console.error('ERROR in transaction.helper nextStage()', error.message);
      throw {
        message: `error while trying to next stage. error: ${error.message}`,
      };
    }
  },
  getActiveStage: async (transactionId: number) => {
    return await transactionStageModel.getTransactionStages({
      'ts.transaction_id': transactionId,
      'ts.status': TransactionStageStatus.Active,
    });
  },
  isStageCompleted: async (
    transactionId: number,
    activeStage: ITransactionStage,
    transactionCurrentSide: ITransactionSide,
    transactionOtherSide: ITransactionSide,
    depositBankName?: string,
    depositBankNumber?: number,
    depositBankAccountOwnerFullName?: string,
    depositTransferDate?: string,
    depositReferenceNumber?: string,
    // depositReferenceFile?: File,
    deliveryDate?: Date,
    deliveryType?: string,
    deliveryNotes?: string
  ): Promise<{
    success: boolean;
    additionalData?: Record<string, any>;
    transactionProps?: Record<string, any>;
    errorMessage?: string;
  }> => {
    let additionalData: Record<string, any> | undefined;
    let transactionProps: Record<string, any> | undefined;

    switch (activeStage?.name) {
      case TransactionStageName.Draft:
        const isTransactionCompleted =
          await transactionHelper.isTransactionCompleted(transactionId);
        if (!isTransactionCompleted) {
          return {
            success: false,
            errorMessage:
              'Can`t complete transaction stage, some properties are missing',
          };
        }
        break;
      case TransactionStageName.AuthorizationSideA:
        if (
          transactionCurrentSide?.account.authorizationStatus !==
          AuthorizationStatus.Pending
        ) {
          return {
            success: false,
            errorMessage:
              'Can`t complete transaction stage, side A authorization form is required',
          };
        }
        break;
      case TransactionStageName.AuthorizationSideB:
        if (
          transactionOtherSide?.account.authorizationStatus !==
          AuthorizationStatus.Pending
        ) {
          return {
            success: false,
            errorMessage:
              'Can`t complete transaction stage, side B authorization form is required',
          };
        }
        break;
      case TransactionStageName.ConfirmationSideB:
        //  No additional data
        break;
      case TransactionStageName.BuyerDeposit:
        if (
          _.isNil(depositBankName) ||
          _.isNil(depositBankNumber) ||
          _.isNil(depositBankAccountOwnerFullName) ||
          _.isNil(depositTransferDate) ||
          _.isNil(depositReferenceNumber)
          // _.isNil(depositReferenceFile)
        ) {
          return {
            success: false,
            errorMessage: 'Invalid Parameters',
          };
        }
        // await fileHelper.uploadFile(
        //   Tables.TRANSACTIONS,
        //   transactionId,
        //   depositReferenceFile
        // );
        transactionProps = {
          depositBankName,
          depositBankNumber,
          depositBankAccountOwnerFullName,
          depositTransferDate,
          depositReferenceNumber,
        };
        break;
      case TransactionStageName.SellerProductTransfer:
        if (
          _.isNil(deliveryDate) ||
          _.isNil(deliveryType) ||
          _.isNil(deliveryNotes)
        ) {
          return {
            success: false,
            errorMessage: 'Invalid Parameters',
          };
        }
        additionalData = {
          deliveryDate,
          deliveryType,
          deliveryNotes,
        };
        break;
      case TransactionStageName.BuyerProductConfirmation:
        //  No additional data
        break;
      case TransactionStageName.Completed:
        return {
          success: false,
          errorMessage: 'No next stages for completed transaction',
        };
      case TransactionStageName.DepositConfirmation:
      case TransactionStageName.AuthorizationSideAConfirmation:
      case TransactionStageName.AuthorizationSideBConfirmation:
      case TransactionStageName.SellerPayment:
      default:
        return {
          success: false,
          errorMessage: 'Only admin stages',
        };
    }
    return { success: true, additionalData, transactionProps };
  },
};

const setPreviousStageCompleted = async (
  transactionId: number,
  activeStageId: number,
  userId: number,
  transactionProps?: Record<string, any>,
  additionalData?: Record<string, any>
) => {
  if (transactionProps) {
    await transactionModel.updateTransaction(
      { id: transactionId },
      { ...transactionProps }
    );
  }
  await transactionStageModel.updateTransactionStage(
    { transactionId, id: activeStageId },
    {
      status: TransactionStageStatus.Completed,
      userId,
      additionalData,
    }
  );
};
//  sets one choice next stage
const createNextStage = async (
  transactionId: number,
  nextStages: TransactionStageName[]
) => {
  if (nextStages[0] === TransactionStageName.Completed) {
    await transactionModel.updateTransaction(
      { id: transactionId },
      { status: TransactionStatus.Completed }
    );
  }

  return await transactionStageModel.createTransactionStage({
    transactionId,
    name: nextStages[0],
    status: TransactionStageStatus.Active,
    inCharge: transactionStageInCharge[nextStages[0]],
  });
};
//  sets multi choice next stage with logic
const createNextStageFromMultiChoice = async (
  activeStageName: string,
  requester: ITransactionSide,
  transactionId: number,
  nextStages: TransactionStageName[]
) => {
  switch (activeStageName) {
    case TransactionStageName.Draft:
    case TransactionStageName.ConfirmationSideB:
      const sum = await transactionModel.getTransactionsAmountSumLastHalfYear(
        requester.account.id
      );
      if (sum <= 50000) {
        return await transactionStageModel.createTransactionStage({
          transactionId,
          name: nextStages[1],
          status: TransactionStageStatus.Active,
          inCharge: transactionStageInCharge[nextStages[1]],
        });
      } else {
        return await transactionStageModel.createTransactionStage({
          transactionId,
          name: nextStages[0],
          status: TransactionStageStatus.Active,
          inCharge: transactionStageInCharge[nextStages[0]],
        });
      }
    default:
      throw 'error!';
  }
};

export default transactionStageHelper;
