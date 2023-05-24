import { IBankDetails } from 'safe-shore-common'

import { Tables } from '../constants'
import { transactionSideModel, userAccountModel } from '../models'
import { bankDetailsModel } from '../models/bankDetails.model'
import { CreateBankDetailsBody } from '../types/requestBody.types'
import transactionHelper from './transaction.helper'

const bankDetailsHelper = {
  createNewBankDetails: async (bankDetailsBody: CreateBankDetailsBody): Promise<IBankDetails> => {
    await bankDetailsModel.updateBankDetails(
      { accountId: bankDetailsBody.accountId, isActive: true },
      { isActive: false }
    )
    const bankDetails = (
      await bankDetailsModel.createBankDetails({
        ...bankDetailsBody,
        isActive: true
      })
    )[0]

    const activeTransactions = await transactionHelper.getAllActiveTransactions(bankDetailsBody.accountId)

    const userAccount = await userAccountModel.getUserAccount({
      [`${Tables.ACCOUNTS}.id`]: bankDetailsBody.accountId
    })

    if (!userAccount) {
      throw 'No user account found'
    }

    await transactionSideModel.updateTransactionSide(
      `user_account_id = '${userAccount.id}' AND transaction_id IN (${activeTransactions.map(
        (activeTransaction) => activeTransaction.id
      )})`,
      {
        bankDetailsId: bankDetails.id
      }
    )
    return bankDetails
  }
}

export default bankDetailsHelper
