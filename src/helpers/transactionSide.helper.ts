import { ITransactionSide, TransactionSide, IUser } from 'safe-shore-common';
import {
  transactionSideModel,
  userModel,
  userAccountModel,
} from '../models/index';
import usersHelper from './users.helper';

const transactionSideHelper = {
  getTransactionSides: async (
    transactionId: number,
    currentUserId: number
  ): Promise<
    [
      transactionCurrentSide: ITransactionSide | undefined,
      transactionOtherSide: ITransactionSide | undefined
    ]
  > => {
    const transactionSides = await transactionSideModel.getTransactionSides({
      'ts.transaction_id': transactionId,
    });

    if (transactionSides[0].user.id === currentUserId) {
      return [transactionSides[0], transactionSides[1]];
    } else {
      return [transactionSides[1], transactionSides[0]];
    }
  },
  createTransactionSideA: async (
    transactionId: number,
    userId: number
  ): Promise<ITransactionSide[]> => {
    const sideAUserAccount = await userAccountModel.getUserAccount({
      'u.id': userId,
    });

    if (!sideAUserAccount) {
      throw Error(
        'sideAUserAccount is undefined in transactionSideHelper.helper createTransactionSideA()'
      );
    }

    await transactionSideModel.createTransactionSide({
      userAccountId: sideAUserAccount.id,
      transactionId: transactionId,
      side: TransactionSide.SideA,
      isCreator: true,
    });

    return await transactionSideModel.getTransactionSides({
      transactionId,
    });
  },
  createTransactionSideB: async (
    transactionId: number,
    currentUserId: number,
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    creatorSide: TransactionSide
  ): Promise<ITransactionSide[]> => {
    let sideAUserAccount = await userAccountModel.getUserAccount({
      'u.id': currentUserId,
    });

    let sideBUserAccount = await userAccountModel.getUserAccount({
      'u.email': email,
    });

    if (!sideBUserAccount) {
      const [_, __, sideBUserAccount] =
        await usersHelper.createNotActivatedUser(
          firstName,
          lastName,
          email,
          phoneNumber
        );
    }

    await transactionSideModel.createTransactionSide({
      userAccountId: sideBUserAccount!.id,
      transactionId: transactionId,
      side:
        creatorSide === TransactionSide.Buyer
          ? TransactionSide.Seller
          : TransactionSide.Buyer,
      isCreator: false,
    });

    await transactionSideModel.updateTransactionSide(
      {
        userAccountId: sideAUserAccount!.id,
        transactionId: transactionId,
      },
      {
        side: creatorSide,
      }
    );

    return await transactionSideModel.getTransactionSides({
      transactionId,
    });
  },
  updateTransactionSideB: async (
    transactionId: number,
    sideAUser: IUser,
    sideBUser: IUser,
    firstName: string | undefined,
    lastName: string | undefined,
    email: string | undefined,
    phoneNumber: string | undefined,
    creatorSide: TransactionSide | undefined
  ): Promise<ITransactionSide[]> => {
    if (!sideBUser.isActivated) {
      await userModel.updateUser(
        {
          firstName,
          lastName,
          phoneNumber,
          lastActiveAt: new Date(),
          email,
        },
        {
          id: sideBUser.id,
        }
      );
    }
    if (creatorSide) {
      let sideAUserAccount = await userAccountModel.getUserAccount({
        'u.id': sideAUser.id,
      });
      let sideBUserAccount = await userAccountModel.getUserAccount({
        'u.email': email,
      });

      await transactionSideModel.updateTransactionSide(
        {
          userAccountId: sideAUserAccount!.id,
          transactionId,
        },
        {
          side: creatorSide,
        }
      );
      await transactionSideModel.updateTransactionSide(
        {
          userAccountId: sideBUserAccount!.id,
          transactionId,
        },
        {
          side:
            creatorSide === TransactionSide.Buyer
              ? TransactionSide.Seller
              : TransactionSide.Buyer,
        }
      );
    }
    return await transactionSideModel.getTransactionSides({
      transactionId,
    });
  },
};
export default transactionSideHelper;
