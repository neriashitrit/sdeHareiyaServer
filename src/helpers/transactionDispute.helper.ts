import { transactionSideModel } from '../models/index';
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
        'ts.transaction_id': transactionId,
        'u.id': userId,
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

    return transactionDispute !== undefined;
  },
};
export default transactionDisputeHelper;
