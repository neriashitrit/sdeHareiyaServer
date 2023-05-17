import { TransactionStatus } from 'safe-shore-common';
import { Tables } from '../constants';
import { transactionModel, transactionSideModel } from '../models/index';
import { transactionDisputeModel } from '../models/transactionDispute.model';

const transactionDisputeHelper = {
  createTransactionDispute: async (
    transactionId: number,
    userId: number,
    reason: string,
    reasonOther: string | undefined,
    notes: string
  ): Promise<void> => {
    const currentUserSide = (
      await transactionSideModel.getTransactionSides({
        [`${Tables.TRANSACTION_SIDES}.transaction_id`]: transactionId,
        [`${Tables.USERS}.id`]: userId,
      })
    )[0];

    if (!currentUserSide) {
      throw Error(
        'currentUserSide is undefined in transactionDisputeHelper.helper createTransactionDispute()'
      );
    }

    await transactionDisputeModel.createTransactionDispute({
      reason,
      reasonOther,
      notes,
      transactionId,
      requestingSide: currentUserSide.side,
      userId,
      isCompleted: false,
    });

    await transactionModel.updateTransaction(
      {
        id: transactionId,
      },
      {
        status: TransactionStatus.Dispute,
      }
    );
  },
  closeTransactionDispute: async (
    transactionId: number,
    userId: number
  ): Promise<boolean> => {
    const transactionDispute =
      await transactionDisputeModel.updateTransactionDispute(
        {
          transactionId,
          userId,
        },
        {
          isCompleted: true,
        }
      );

    await transactionModel.updateTransaction(
      {
        id: transactionId,
      },
      {
        status: TransactionStatus.Stage,
      }
    );

    return transactionDispute !== undefined;
  },
};
export default transactionDisputeHelper;
