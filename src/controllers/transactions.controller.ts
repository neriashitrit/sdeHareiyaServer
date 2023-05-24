import { Request, Response } from 'express'
import _ from 'lodash'
import {
  ITransactionSide,
  IUser,
  TransactionSide,
  TransactionStageName,
  TransactionStageStatus,
  TransactionStatus
} from 'safe-shore-common'

import { Tables } from '../constants'
import transactionHelper from '../helpers/transaction.helper'
import transactionDisputeHelper from '../helpers/transactionDispute.helper'
import transactionSideHelper from '../helpers/transactionSide.helper'
import transactionStageHelper from '../helpers/transactionStage.helper'
import {
  commissionModel,
  fileModel,
  transactionModel,
  transactionProductPropertyModel,
  transactionStageModel
} from '../models/index'
import { CreateTransactionBodyProductProperty } from '../types/requestBody.types'
import { failureResponse, successResponse } from '../utils/db.utils'
import { commissionCalculate } from '../utils/global.utils'
import {
  isApproveStageBody,
  isCancelDisputeBody,
  isCreateTransactionBody,
  isGetTransactionParams,
  isOpenDisputeBody,
  isUpdateTransactionBody
} from '../utils/typeCheckers.utils'

export const getTransactions = async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser

    const transactions = await transactionHelper.getFullTransactions({
      userId: user.id
    })

    return res.status(200).json(successResponse(transactions))
  } catch (error) {
    console.error('ERROR in transactions.controller getTransactions()', error.message)
    return res.status(500).json(failureResponse(error.message))
  }
}

export const getTransaction = async (req: Request, res: Response) => {
  try {
    const params = req.params

    if (!isGetTransactionParams(params)) {
      return res.status(400).json(failureResponse('Invalid Parameters'))
    }

    const { transactionId } = params

    const responseTransaction = await transactionHelper.getFullTransaction({
      transactionId
    })

    if (_.isNull(responseTransaction)) {
      return res.status(400).json(failureResponse('No transaction with this id'))
    }

    return res.status(200).json(successResponse(responseTransaction))
  } catch (error) {
    console.error('ERROR in transactions.controller getTransaction()', error.message)
    return res.status(500).send(failureResponse(error.message))
  }
}

export const createTransaction = async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser
    const body = req.body

    if (!isCreateTransactionBody(body)) {
      return res.status(400).json(failureResponse('Invalid Parameters'))
    }

    const result = await transactionHelper.createTransaction(user, body)

    if (_.isNull(result)) {
      return res.status(400).json(failureResponse('Couldn`t create new transaction'))
    }

    return res.status(200).json(successResponse(result))
  } catch (error) {
    console.error('ERROR in transactions.controller createTransaction()', error.message)
    return res.status(500).send(failureResponse(error.message))
  }
}

export const updateTransaction = async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser
    const body = req.body

    if (!isUpdateTransactionBody(body)) {
      return res.status(400).json(failureResponse('Invalid Parameters'))
    }

    const result = await transactionHelper.updateTransaction(user, body)

    if (_.isNull(result)) {
      return res.status(400).json(failureResponse('Couldn`t update transaction'))
    }

    return res.status(200).json(successResponse(result))
  } catch (error) {
    console.error('ERROR in transactions.controller updateTransaction()', error.message)
    return res.status(500).send(failureResponse(error.message))
  }
}

export const approveStage = async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser
    const body = req.body

    if (!isApproveStageBody(body)) {
      return res.status(400).json(failureResponse('Invalid Parameters'))
    }

    const {
      transactionId,
      depositBankName,
      depositBankNumber,
      depositBankAccountOwnerFullName,
      depositTransferDate,
      depositReferenceNumber,
      depositReferenceFile,
      deliveryDate,
      deliveryType,
      deliveryNotes
    } = body

    const [transactionCurrentSide, transactionOtherSide] = await transactionSideHelper.getTransactionSidesByUserId(
      transactionId,
      user.id
    )

    const activeStage = (await transactionStageHelper.getActiveStage(transactionId))[0]

    if (
      activeStage.inCharge !== transactionCurrentSide?.side &&
      !(activeStage.inCharge === TransactionSide.SideA && transactionCurrentSide?.isCreator) &&
      !(activeStage.inCharge === TransactionSide.SideB && !transactionCurrentSide?.isCreator)
    ) {
      return res.status(400).json(failureResponse('Current user is not in charge of this stage'))
    }

    if (!transactionCurrentSide || !transactionOtherSide) {
      throw 'transactionCurrentSide or transactionOtherSide are undefined in transactions.controller approveStage() '
    }

    const { success, additionalData, transactionProps, errorMessage } = await transactionStageHelper.isStageCompleted(
      transactionId,
      activeStage,
      transactionCurrentSide,
      transactionOtherSide,
      depositBankName,
      depositBankNumber,
      depositBankAccountOwnerFullName,
      depositTransferDate,
      depositReferenceNumber,
      depositReferenceFile,
      deliveryDate,
      deliveryType,
      deliveryNotes
    )

    if (!success) {
      return res.status(400).json(failureResponse(errorMessage))
    }

    const nextStage = await transactionStageHelper.nextStage(
      transactionId,
      transactionCurrentSide!,
      activeStage,
      transactionProps,
      additionalData
    )

    return res.status(200).json(successResponse(nextStage!))
  } catch (error) {
    console.error('ERROR in transactions.controller approveStage()', error.message)
    return res.status(500).send(failureResponse(error.message))
  }
}

export const openDispute = async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser
    const body = req.body

    if (!isOpenDisputeBody(body)) {
      return res.status(400).json(failureResponse('Invalid Parameters'))
    }

    const { transactionId, reason, reasonOther, notes } = body

    await transactionDisputeHelper.createTransactionDispute(transactionId, user.id, reason, reasonOther, notes)

    return res.status(200).json(successResponse({}))
  } catch (error) {
    console.error('ERROR in transactions.controller openDispute()', error.message)
    return res.status(500).send(failureResponse(error.message))
  }
}

export const cancelDispute = async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser
    const body = req.body

    if (!isCancelDisputeBody(body)) {
      return res.status(400).json(failureResponse('Invalid Parameters'))
    }

    const { transactionId } = body

    const result = await transactionDisputeHelper.closeTransactionDispute(transactionId, user.id)

    if (!result) {
      return res.status(400).json(failureResponse('Could not cancel dispute'))
    }

    return res.status(200).json(successResponse({}))
  } catch (error) {
    console.error('ERROR in transactions.controller cancelDispute()', error.message)
    return res.status(500).send(failureResponse(error.message))
  }
}
