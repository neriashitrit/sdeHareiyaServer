import { ITransactionSide, IUser, TransactionSide } from 'safe-shore-common'

import { Tables } from '../constants'
import { transactionSideModel, userAccountModel, userModel } from '../models/index'
import usersHelper from './users.helper'

const transactionSideHelper = {
  getTransactionSidesByUserId: async (
    transactionId: number,
    userId: number
  ): Promise<
    [transactionCurrentSide: ITransactionSide | undefined, transactionOtherSide: ITransactionSide | undefined]
  > => {
    const transactionSides = await transactionSideModel.getTransactionSides({
      [`${Tables.TRANSACTION_SIDES}.transaction_id`]: transactionId
    })

    if (transactionSides[0].user.id === userId) {
      return [transactionSides[0], transactionSides[1]]
    } else {
      return [transactionSides[1], transactionSides[0]]
    }
  },
  getTransactionSidesByAccountId: async (
    transactionId: number,
    accountId: number
  ): Promise<
    [transactionCurrentSide: ITransactionSide | undefined, transactionOtherSide: ITransactionSide | undefined]
  > => {
    const transactionSides = await transactionSideModel.getTransactionSides({
      [`${Tables.TRANSACTION_SIDES}.transaction_id`]: transactionId
    })

    if (transactionSides[0].account.id === accountId) {
      return [transactionSides[0], transactionSides[1]]
    } else {
      return [transactionSides[1], transactionSides[0]]
    }
  },
  createTransactionSideA: async (transactionId: number, userId: number): Promise<ITransactionSide[]> => {
    const sideAUserAccount = await userAccountModel.getUserAccount({
      [`${Tables.USERS}.id`]: userId
    })

    if (!sideAUserAccount) {
      throw Error('sideAUserAccount is undefined in transactionSideHelper.helper createTransactionSideA()')
    }

    await transactionSideModel.createTransactionSide({
      userAccountId: sideAUserAccount.id,
      transactionId: transactionId,
      side: TransactionSide.SideA,
      isCreator: true,
      bankDetailsId: sideAUserAccount.account?.bankDetails?.id
    })

    return await transactionSideModel.getTransactionSides({
      transactionId
    })
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
    const sideAUserAccount = await userAccountModel.getUserAccount({
      [`${Tables.USERS}.id`]: currentUserId
    })

    let sideBUserAccount = await userAccountModel.getUserAccount({
      [`${Tables.USERS}.phone_number`]: phoneNumber
    })

    if (!sideBUserAccount) {
      const [_, __, userAccount] = await usersHelper.createNotActivatedUser(firstName, lastName, email, phoneNumber)
      sideBUserAccount = userAccount
    }

    await transactionSideModel.createTransactionSide({
      userAccountId: sideBUserAccount!.id,
      transactionId: transactionId,
      side: creatorSide === TransactionSide.Buyer ? TransactionSide.Seller : TransactionSide.Buyer,
      isCreator: false
    })

    await transactionSideModel.updateTransactionSide(
      {
        userAccountId: sideAUserAccount!.id,
        transactionId: transactionId
      },
      {
        side: creatorSide
      }
    )

    return await transactionSideModel.getTransactionSides({
      transactionId
    })
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
          email
        },
        {
          id: sideBUser.id
        }
      )
    }
    if (creatorSide) {
      const sideAUserAccount = await userAccountModel.getUserAccount({
        [`${Tables.USERS}.id`]: sideAUser.id
      })

      const sideBUserAccount = await userAccountModel.getUserAccount({
        [`${Tables.USERS}.id`]: sideBUser.id
      })

      await transactionSideModel.updateTransactionSide(
        {
          userAccountId: sideAUserAccount!.id,
          transactionId
        },
        {
          side: creatorSide
        }
      )
      await transactionSideModel.updateTransactionSide(
        {
          userAccountId: sideBUserAccount!.id,
          transactionId
        },
        {
          side: creatorSide === TransactionSide.Buyer ? TransactionSide.Seller : TransactionSide.Buyer
        }
      )
    }
    return await transactionSideModel.getTransactionSides({
      transactionId
    })
  },
  deleteTransactionSideB: async (transactionId: number, transactionSideBId: number): Promise<void> => {
    await transactionSideModel.deleteTransactionSide({ id: transactionSideBId })
  }
}
export default transactionSideHelper
