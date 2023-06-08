import { ITransactionDispute, TransactionStatus } from 'safe-shore-common'

import { EmailTemplateName, Tables, emailSubjectMapping } from '../constants'
import { transactionDisputeModel, transactionModel, transactionSideModel } from '../models/index'
import '../models/transactionDispute.model'
import EmailService from '../services/email.service'
import globalHelper from './global.helper'

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
        [`${Tables.USERS}.id`]: userId
      })
    )[0]

    if (!currentUserSide) {
      throw Error('currentUserSide is undefined in transactionDisputeHelper.helper createTransactionDispute()')
    }

    await transactionDisputeModel.createTransactionDispute({
      reason,
      reasonOther,
      notes,
      transactionId,
      requestingSide: currentUserSide.side,
      userId,
      isCompleted: false
    })

    await transactionModel.updateTransactions(
      {
        id: transactionId
      },
      {
        status: TransactionStatus.Dispute
      }
    )

    const transactionSides = await transactionSideModel.getTransactionSides({
      [`${Tables.TRANSACTION_SIDES}.transaction_id`]: transactionId
    })

    globalHelper.sendEmailTrigger(
      EmailTemplateName.OPEN_DISPUTE,
      [...transactionSides.map((side) => side!.user.email), EmailService.defaultMailSender],
      emailSubjectMapping[EmailTemplateName.OPEN_DISPUTE]
    )
  },
  cancelTransactionDisputeById: async (
    disputeId: number,
    adminNotes: string
  ): Promise<ITransactionDispute | undefined> => {
    const transactionDispute = await transactionDisputeModel.updateTransactionDispute(
      {
        id: disputeId
      },
      {
        isCompleted: true,
        adminNotes
      }
    )

    await transactionModel.updateTransactions(
      {
        id: transactionDispute?.transactionId
      },
      {
        status: TransactionStatus.Stage
      }
    )

    const transactionSides = await transactionSideModel.getTransactionSides({
      [`${Tables.TRANSACTION_SIDES}.transaction_id`]: transactionDispute?.transactionId
    })

    globalHelper.sendEmailTrigger(
      EmailTemplateName.RESOLVED_DISPUTE,
      [...transactionSides.map((side) => side!.user.email), EmailService.defaultMailSender],
      emailSubjectMapping[EmailTemplateName.RESOLVED_DISPUTE]
    )

    return transactionDispute
  },
  cancelTransactionDispute: async (transactionId: number, userId: number): Promise<boolean> => {
    const transactionDispute = await transactionDisputeModel.updateTransactionDispute(
      {
        transactionId,
        userId
      },
      {
        isCompleted: true
      }
    )

    await transactionModel.updateTransactions(
      {
        id: transactionId
      },
      {
        status: TransactionStatus.Stage
      }
    )

    const transactionSides = await transactionSideModel.getTransactionSides({
      [`${Tables.TRANSACTION_SIDES}.transaction_id`]: transactionDispute?.transactionId
    })

    globalHelper.sendEmailTrigger(
      EmailTemplateName.RESOLVED_DISPUTE,
      [...transactionSides.map((side) => side!.user.email), EmailService.defaultMailSender],
      emailSubjectMapping[EmailTemplateName.RESOLVED_DISPUTE]
    )

    return transactionDispute !== undefined
  }
}
export default transactionDisputeHelper
