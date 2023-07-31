import { Request, Response } from 'express'
import _ from 'lodash'
import { AuthorizationStatus, IUser } from 'safe-shore-common'

import { Tables } from '../../constants'
import accountHelper from '../../helpers/account.helper'
import bankDetailsHelper from '../../helpers/bankDetails.helper'
import transactionHelper from '../../helpers/transaction.helper'
import transactionStageHelper from '../../helpers/transactionStage.helper'
import { bankDetailsModel } from '../../models/bankDetails.model'
import { accountModel } from '../../models/index'
import { buildConditionString, conditionTerm, failureResponse, successResponse } from '../../utils/db.utils'
import { isApproveAccountAuthorizationBody, isCreateBankDetailsBody } from '../../utils/typeCheckers.utils'

export const getAllAccounts = async (req: Request, res: Response) => {
  try {
    const startDate = req.body.startDate as string
    const endDate = req.body.endDate as string
    const conditions: conditionTerm[] = [
      {
        column: Tables.USERS + '.role',
        operator: '<>',
        value: 'admin'
      }
    ]
    if (startDate) {
      conditions.push({
        column: Tables.USERS + '.last_active_at',
        operator: '>=',
        value: startDate
      })
    }
    if (endDate) {
      conditions.push({
        column: Tables.USERS + '.last_active_at',
        operator: '<=',
        value: endDate
      })
    }
    const condition = buildConditionString(conditions)
    const accounts = await accountModel.getAllAccounts(condition)
    res.status(200).json(successResponse(accounts))
  } catch (error: any) {
    res.status(500).json(failureResponse(error))
  }
}

export const getAccountById = async (req: Request, res: Response) => {
  const { accountId } = req.params
  try {
    const account = await accountModel.getAccount({
      [`${Tables.ACCOUNTS}.id`]: accountId
    })
    if (_.isEmpty(account)) {
      return res.status(400).json(failureResponse('No account with this id'))
    }
    return res.status(200).json(successResponse(account[0]))
  } catch (error: any) {
    return res.status(500).json(failureResponse(error))
  }
}

export const approveAccountAuthorization = async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser
    const body = req.body

    if (!isApproveAccountAuthorizationBody(body)) {
      return res.status(400).json(failureResponse('Invalid Parameters'))
    }

    const { accountId, status } = body

    const result = await accountHelper.approveAccountAuthorization(accountId, status)

    if (!result) {
      return res.status(400).json(failureResponse('Cant submit authorization form for this account'))
    }

    if (body.status === AuthorizationStatus.Authorized) {
      const pendingAuthTransactions = await transactionHelper.getPendingAuthConfirmationTransactions(accountId)

      for (const transaction of pendingAuthTransactions) {
        const activeStage = (await transactionStageHelper.getActiveStage(transaction.id))[0]

        transactionStageHelper.adminNextStage(transaction.id, user.id, activeStage)
      }
    } else if (body.status === AuthorizationStatus.Blocked) {
      await transactionHelper.cancelAllActiveTransactions(accountId)
    }

    const updatedAccount = (await accountModel.getAccount({ [`${Tables.ACCOUNTS}.id`]: accountId }))[0]

    return res.status(200).json(successResponse(updatedAccount))
  } catch (error) {
    return res.status(500).json(failureResponse(error))
  }
}

export const createBankDetails = async (req: Request, res: Response) => {
  try {
    const body = req.body

    if (!isCreateBankDetailsBody(body)) {
      return res.status(400).json(failureResponse('Invalid Parameters'))
    }

    const account = (
      await accountModel.getAccount({
        [`${Tables.ACCOUNTS}.id`]: body.accountId
      })
    )[0]

    if (!account) {
      return res.status(400).json(failureResponse('Invalid Parameters'))
    }

    const bankDetails = await bankDetailsHelper.createNewBankDetails(body)

    account.bankDetails = bankDetails

    return res.status(200).json(successResponse(account))
  } catch (error) {
    return res.status(500).json(failureResponse(error))
  }
}

export const updateAccountBankDetails = async (req: Request, res: Response) => {
  try {
    const body = req.body

    if (!isCreateBankDetailsBody(body)) {
      return res.status(400).json(failureResponse('Invalid Parameters'))
    }

    await bankDetailsModel.updateBankDetails({ accountId: body.accountId, isActive: true }, { isActive: false })
    await bankDetailsModel.createBankDetails({
      ...body,
      isActive: true
    })

    const updatedAccount = await accountModel.getAccount({ [Tables.ACCOUNTS + '.id']: body.accountId })
    return res.status(200).json(successResponse(updatedAccount))
  } catch (error) {
    return res.status(500).json(failureResponse(error))
  }
}
