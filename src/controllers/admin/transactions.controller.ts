import { Request, Response } from 'express'
import _ from 'lodash'
import { IUser, TransactionStageName } from 'safe-shore-common'
import { TransactionSide, TransactionStatus } from 'safe-shore-common'

import { Tables, conditionForTransactionsNeedAuthorization } from '../../constants'
import bankDetailsHelper from '../../helpers/bankDetails.helper'
import transactionHelper from '../../helpers/transaction.helper'
import transactionDisputeHelper from '../../helpers/transactionDispute.helper'
import transactionStageHelper from '../../helpers/transactionStage.helper'
import { transactionModel } from '../../models'
import { buildConditionString, failureResponse, successResponse } from '../../utils/db.utils'
import { isAdminApproveDisputeBody, isAdminApproveStageBody, isAdminApproveTransactionBody } from '../../utils/typeCheckers.utils'

export const getAllTransactions = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.body
    const condition = buildConditionString([
      {
        column: Tables.TRANSACTIONS + '.updated_at',
        operator: '>=',
        value: startDate
      },
      {
        column: Tables.TRANSACTIONS + '.updated_at',
        operator: '<=',
        value: endDate
      }
    ])
    const transactions = await transactionHelper.getFullTransactions({
      condition
    })
    res.status(200).json(successResponse(transactions))
  } catch (error: any) {
    console.log(error)
    res.status(500).json(failureResponse(error))
  }
}

export const getTransactionById = async (req: Request, res: Response) => {
  try {
    const { transactionId } = req.params
    const condition = buildConditionString([
      {
        column: Tables.TRANSACTIONS + '.id',
        value: transactionId
      }
    ])
    const transaction = await transactionHelper.getFullTransactions({
      condition
    })

    if (_.isEmpty(transaction)) {
      return res.status(400).json(failureResponse('No transaction with this id'))
    }
    return res.status(200).json(successResponse(transaction[0]))
  } catch (error: any) {
    console.log(error)
    return res.status(500).json(failureResponse(error))
  }
}

export const getTransactionsByAccount = async (req: Request, res: Response) => {
  try {
    const { accountId, startDate, endDate } = req.body

    const condition = buildConditionString([
      {
        column: Tables.TRANSACTION_SIDES + '.user_account_id',
        value: accountId
      },
      {
        column: Tables.TRANSACTIONS + '.updated_at',
        operator: '>=',
        value: startDate
      },
      {
        column: Tables.TRANSACTIONS + '.updated_at',
        operator: '<=',
        value: endDate
      }
    ])

    const transactions = await transactionHelper.getFullTransactions({
      condition
    })

    return res.status(200).json(successResponse(transactions))
  } catch (error: any) {
    console.log(error)
    return res.status(500).json(failureResponse(error))
  }
}

export const settleTransactionDispute = async (req: Request, res: Response) => {
  try {
    if (!isAdminApproveDisputeBody(req.body)) {
      return res.status(400).json(failureResponse('Invalid Parameters'))
    }
    const { transactionId, userId, continueTransaction } = req.body

    const closeDispute = await transactionDisputeHelper.closeTransactionDispute(transactionId, userId)

    if (!continueTransaction) {
      //move transaction to canceled status
      const updateTransaction = await transactionModel.updateTransactions(
        {
          id: transactionId
        },
        {
          status: TransactionStatus.Canceled
        }
      )
    }
    const condition = buildConditionString([
      {
        column: Tables.TRANSACTIONS + '.id',
        value: String(transactionId)
      }
    ])
    const transaction = await transactionHelper.getFullTransactions({
      condition
    })
    return res.status(200).json(successResponse(transaction[0]))
  } catch (error: any) {
    console.log(error)
    return res.status(500).json(failureResponse(error))
  }
}

export const getAutorizeTransactions = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.body
    const condition = buildConditionString([
      {
        column: Tables.TRANSACTIONS + '.updated_at',
        operator: '>=',
        value: startDate
      },
      {
        column: Tables.TRANSACTIONS + '.updated_at',
        operator: '<=',
        value: endDate
      },
      ...conditionForTransactionsNeedAuthorization
    ])
    const transactions = await transactionHelper.getFullTransactions({
      condition
    })
    res.status(200).json(successResponse(transactions))
  } catch (error: any) {
    console.log(error)
    res.status(500).json(failureResponse(error))
  }
}

export const getTransactionsStatusAnalytics = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.body
    const analytics = await transactionModel.getTransactionsStatusAnalytics(startDate, endDate)
    res.status(200).json(successResponse(analytics))
  } catch (error: any) {
    console.log(error)
    res.status(500).json(failureResponse(error))
  }
}

export const getTransactionsProductsAnalytics = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.body
    const analytics = await transactionModel.getTransactionsProductsAnalytics(startDate, endDate)
    res.status(200).json(successResponse(analytics))
  } catch (error: any) {
    console.log(error)
    res.status(500).json(failureResponse(error))
  }
}

export const approveStage = async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser
    const body = req.body

    if (!isAdminApproveStageBody(body)) {
      return res.status(400).json(failureResponse('Invalid Parameters'))
    }

    const { transactionId } = body

    const activeStage = (await transactionStageHelper.getActiveStage(transactionId))[0]

    if (
      !activeStage ||
      [
        TransactionStageName.AuthorizationSideAConfirmation,
        TransactionStageName.AuthorizationSideBConfirmation
      ].includes(activeStage.name) ||
      activeStage.inCharge !== TransactionSide.Admin
    ) {
      return res.status(400).json(failureResponse('Admin is not in charge of this stage'))
    }
    await transactionStageHelper.adminNextStage(transactionId, user.id, activeStage)
    const condition = buildConditionString([
      {
        column: Tables.TRANSACTIONS + '.id',
        value: String(transactionId)
      }
    ])
    const transaction = await transactionHelper.getFullTransactions({
      condition
    })

    return res.status(200).json(successResponse(transaction[0]))
  } catch (error) {
    console.error('ERROR in transactions.controller approveStage()', error.message)
    return res.status(500).send(failureResponse(error.message))
  }
}

export const approveTransaction = async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser
    const body = req.body

    if (!isAdminApproveTransactionBody(body)) {
      return res.status(400).json(failureResponse('Invalid Parameters'))
    }

    const { transactionId, bankDetails } = body
    await bankDetailsHelper.createNewBankDetails(bankDetails);

    const activeStage = (await transactionStageHelper.getActiveStage(transactionId))[0]

    if (
      !activeStage ||
      [
        TransactionStageName.AuthorizationSideAConfirmation,
        TransactionStageName.AuthorizationSideBConfirmation
      ].includes(activeStage.name) ||
      activeStage.inCharge !== TransactionSide.Admin
    ) {
      return res.status(400).json(failureResponse('Admin is not in charge of this stage'))
    }
    await transactionStageHelper.adminNextStage(transactionId, user.id, activeStage)
    const condition = buildConditionString([
      {
        column: Tables.TRANSACTIONS + '.id',
        value: String(transactionId)
      }
    ])
    const transaction = await transactionHelper.getFullTransactions({
      condition
    })

    return res.status(200).json(successResponse(transaction[0]))
  } catch (error) {
    console.error('ERROR in transactions.controller approveStage()', error.message)
    return res.status(500).send(failureResponse(error.message))
  }
}
