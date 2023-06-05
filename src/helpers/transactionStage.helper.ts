import _ from 'lodash'
import {
  AuthorizationStatus,
  ITransaction,
  ITransactionSide,
  ITransactionStage,
  TransactionSide,
  TransactionStageName,
  TransactionStageStatus,
  TransactionStatus
} from 'safe-shore-common'

import {
  Tables,
  transactionStageInCharge,
  transactionStagePossiblePaths,
  transactionStageToEmailTriggerMapping
} from '../constants'
import { fileModel, transactionModel, transactionSideModel, transactionStageModel } from '../models/index'
import EmailService from '../services/email.service'
import globalHelper from './global.helper'
import transactionHelper from './transaction.helper'

const transactionStageHelper = {
  adminNextStage: async (transactionId: number, userId: number, activeStage: ITransactionStage) => {
    try {
      const nextStages = transactionStagePossiblePaths[activeStage.name]

      await setPreviousStageCompleted(transactionId, activeStage.id, userId)

      const nextStage = await createNextStage(transactionId, nextStages)

      const transactionSides = await transactionSideModel.getTransactionSides({
        [`${Tables.TRANSACTION_SIDES}.transaction_id`]: transactionId
      })

      const emailTriggers = transactionStageToEmailTriggerMapping[nextStage.name]
      if (emailTriggers) {
        emailTriggers.forEach(({ to, subject, template }) => {
          globalHelper.sendEmailTrigger(
            template,
            [emailTriggerRecipient(to, transactionSides)?.user.email ?? EmailService.defaultMailSender],
            subject
          )
        })
      }
      return nextStage
    } catch (error) {
      console.error('ERROR in transaction.helper nextStage()', error.message)
      throw {
        message: `error while trying to next stage. error: ${error.message}`
      }
    }
  },
  nextStage: async (
    transactionId: number,
    requestingSide: ITransactionSide,
    otherSide: ITransactionSide,
    activeStage: ITransactionStage,
    transactionProps?: Record<string, any>,
    additionalData?: Record<string, any>
  ): Promise<ITransactionStage | undefined> => {
    try {
      const transaction = (await transactionModel.getTransactions({ [`${Tables.TRANSACTIONS}.id`]: transactionId }))[0]

      const nextStages = transactionStagePossiblePaths[activeStage.name]

      await setPreviousStageCompleted(
        transaction.id,
        activeStage.id,
        requestingSide.user.id,
        transactionProps,
        additionalData
      )

      let nextStage: ITransactionStage | undefined
      if (nextStages.length === 1) {
        nextStage = await createNextStage(transaction.id, nextStages)
      } else if (nextStages.length > 1) {
        nextStage = await createNextStageFromMultiChoice(activeStage.name, requestingSide, transaction, nextStages)
      }
      if (nextStage) {
        const emailTriggers = transactionStageToEmailTriggerMapping[nextStage.name]

        if (emailTriggers) {
          emailTriggers.forEach(({ to, subject, template }) => {
            globalHelper.sendEmailTrigger(
              template,
              [emailTriggerRecipient(to, [requestingSide, otherSide])?.user.email ?? EmailService.defaultMailSender],
              subject
            )
          })
        }
      }
      return nextStage
    } catch (error) {
      console.error('ERROR in transaction.helper nextStage()', error.message)
      throw {
        message: `error while trying to next stage. error: ${error.message}`
      }
    }
  },
  getActiveStage: async (transactionId: number) => {
    return await transactionStageModel.getTransactionStages({
      [`${Tables.TRANSACTION_STAGES}.transaction_id`]: transactionId,
      [`${Tables.TRANSACTION_STAGES}.status`]: TransactionStageStatus.Active
    })
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
    depositReferenceFile?: string,
    deliveryDate?: Date,
    deliveryType?: string,
    deliveryNotes?: string
  ): Promise<{
    success: boolean
    additionalData?: Record<string, any>
    transactionProps?: Record<string, any>
    errorMessage?: string
  }> => {
    let additionalData: Record<string, any> | undefined
    let transactionProps: Record<string, any> | undefined
    let isTransactionCompleted: boolean
    switch (activeStage?.name) {
      case TransactionStageName.Draft:
        isTransactionCompleted = await transactionHelper.isTransactionCompleted(transactionId)
        if (!isTransactionCompleted) {
          return {
            success: false,
            errorMessage: 'Can`t complete transaction stage, some properties are missing'
          }
        }
        break
      case TransactionStageName.AuthorizationSideA:
        if (transactionCurrentSide?.account.authorizationStatus !== AuthorizationStatus.Pending) {
          return {
            success: false,
            errorMessage: 'Can`t complete transaction stage, side A authorization form is required'
          }
        }
        break
      case TransactionStageName.AuthorizationSideB:
        if (transactionOtherSide?.account.authorizationStatus !== AuthorizationStatus.Pending) {
          return {
            success: false,
            errorMessage: 'Can`t complete transaction stage, side B authorization form is required'
          }
        }
        break
      case TransactionStageName.ConfirmationSideB:
        //  No additional data
        break
      case TransactionStageName.BuyerDeposit:
        if (
          _.isNil(depositBankName) ||
          _.isNil(depositBankNumber) ||
          _.isNil(depositBankAccountOwnerFullName) ||
          _.isNil(depositTransferDate) ||
          _.isNil(depositReferenceNumber) ||
          _.isNil(depositReferenceFile)
        ) {
          return {
            success: false,
            errorMessage: 'Invalid Parameters'
          }
        }
        await fileModel.updateFiles(
          { url: depositReferenceFile },
          { rowId: transactionId, tableName: Tables.TRANSACTIONS }
        )

        transactionProps = {
          depositBankName,
          depositBankNumber,
          depositBankAccountOwnerFullName,
          depositTransferDate,
          depositReferenceNumber
        }
        break
      case TransactionStageName.SellerProductTransfer:
        if (_.isNil(deliveryDate) || _.isNil(deliveryType) || _.isNil(deliveryNotes)) {
          return {
            success: false,
            errorMessage: 'Invalid Parameters'
          }
        }
        additionalData = {
          deliveryDate,
          deliveryType,
          deliveryNotes
        }
        break
      case TransactionStageName.BuyerProductConfirmation:
        //  No additional data
        break
      case TransactionStageName.Completed:
        return {
          success: false,
          errorMessage: 'No next stages for completed transaction'
        }
      case TransactionStageName.DepositConfirmation:
      case TransactionStageName.AuthorizationSideAConfirmation:
      case TransactionStageName.AuthorizationSideBConfirmation:
      case TransactionStageName.SellerPayment:
      default:
        return {
          success: false,
          errorMessage: 'Only admin stages'
        }
    }
    return { success: true, additionalData, transactionProps }
  }
}

const setPreviousStageCompleted = async (
  transactionId: number,
  activeStageId: number,
  userId: number,
  transactionProps?: Record<string, any>,
  additionalData?: Record<string, any>
) => {
  if (transactionProps) {
    await transactionModel.updateTransactions({ id: transactionId }, { ...transactionProps })
  }
  await transactionStageModel.updateTransactionStage(
    { transactionId, id: activeStageId },
    {
      status: TransactionStageStatus.Completed,
      userId,
      additionalData
    }
  )
}
//  sets one choice next stage
const createNextStage = async (transactionId: number, nextStages: TransactionStageName[]) => {
  let status = TransactionStageStatus.Active
  if (nextStages[0] === TransactionStageName.Completed) {
    status = TransactionStageStatus.Completed
    await transactionModel.updateTransactions({ id: transactionId }, { status: TransactionStatus.Completed })
  }

  return await transactionStageModel.createTransactionStage({
    transactionId,
    name: nextStages[0],
    status,
    inCharge: transactionStageInCharge[nextStages[0]]
  })
}
//  sets multi choice next stage with logic
const createNextStageFromMultiChoice = async (
  activeStageName: string,
  requestingSide: ITransactionSide,
  transaction: ITransaction,
  nextStages: TransactionStageName[]
) => {
  let sum: number
  switch (activeStageName) {
    case TransactionStageName.Draft:
    case TransactionStageName.ConfirmationSideB:
      sum = await transactionModel.getTransactionsAmountSumLastHalfYear(requestingSide.account.id)
      if (
        sum + transaction.amount <= 50000 ||
        requestingSide.account.authorizationStatus === AuthorizationStatus.Authorized
      ) {
        return await transactionStageModel.createTransactionStage({
          transactionId: transaction.id,
          name: nextStages[1],
          status: TransactionStageStatus.Active,
          inCharge: transactionStageInCharge[nextStages[1]]
        })
      } else {
        return await transactionStageModel.createTransactionStage({
          transactionId: transaction.id,
          name: nextStages[0],
          status: TransactionStageStatus.Active,
          inCharge: transactionStageInCharge[nextStages[0]]
        })
      }
    default:
      throw 'error!'
  }
}

const emailTriggerRecipient = (side: TransactionSide, sides: ITransactionSide[]): ITransactionSide | null => {
  const [sideA, sideB] = sides[0].isCreator ? sides : sides.reverse()
  const [buyer, seller] = sides[0].side === TransactionSide.Buyer ? sides : sides.reverse()

  switch (side) {
    case TransactionSide.SideA:
      return sideA
    case TransactionSide.SideB:
      return sideB
    case TransactionSide.Buyer:
      return buyer
    case TransactionSide.Seller:
      return seller
    default:
    case TransactionSide.Admin:
      return null
  }
}

export default transactionStageHelper
