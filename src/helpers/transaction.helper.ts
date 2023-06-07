import _ from 'lodash'
import {
  ITransaction,
  ITransactionDispute,
  ITransactionProductProperty,
  ITransactionSide,
  ITransactionStage,
  IUser,
  TransactionSide,
  TransactionStageName,
  TransactionStageStatus,
  TransactionStatus
} from 'safe-shore-common'

import { EmailTemplateName, Tables } from '../constants'
import {
  commissionModel,
  fileModel,
  productPropertyModel,
  transactionDisputeModel,
  transactionModel,
  transactionProductPropertyModel,
  transactionSideModel,
  transactionStageModel
} from '../models/index'
import EmailService from '../services/email.service'
import {
  CreateTransactionBody,
  CreateTransactionBodyProductProperty,
  UpdateTransactionBody
} from '../types/requestBody.types'
import { commissionCalculate } from '../utils/global.utils'
import globalHelper from './global.helper'
import transactionSideHelper from './transactionSide.helper'
import transactionStageHelper from './transactionStage.helper'

const transactionHelper = {
  createTransaction: async (
    user: IUser,
    {
      productCategoryId,
      productCategoryOther,
      productSubcategoryId,
      productSubcategoryOther,
      currency,
      amount,
      properties
    }: CreateTransactionBody
  ): Promise<ITransaction | null> => {
    const commissionObject = await getCommissionByAmount(amount)

    const newTransaction = await transactionModel.createTransaction({
      status: TransactionStatus.Stage,
      productCategoryId,
      productCategoryOther,
      productSubcategoryId,
      productSubcategoryOther,
      amountCurrency: currency,
      amount,
      commissionId: commissionObject.commissionId,
      commissionAmountCurrency: currency,
      commissionAmount: commissionObject.amount
    })

    if (!newTransaction) {
      return null
    }

    const transactionStage = await transactionStageModel.createTransactionStage({
      name: TransactionStageName.Draft,
      transactionId: newTransaction.id,
      inCharge: TransactionSide.SideA,
      status: TransactionStageStatus.Active,
      userId: user.id
    })

    await upsertProductProperties(newTransaction.id, properties)

    const transactionSides = await transactionSideHelper.createTransactionSideA(newTransaction.id, user.id)

    return await transactionHelper.getFullTransaction({
      transactionId: newTransaction.id,
      sides: transactionSides,
      stages: transactionStage ? [transactionStage] : [],
      disputes: []
    })
  },
  updateTransaction: async (
    user: IUser,
    {
      transactionId,
      productCategoryId,
      productCategoryOther,
      productSubcategoryId,
      productSubcategoryOther,
      currency,
      amount,
      properties,
      endDate,
      commissionPayer,
      creatorSide,
      firstName,
      lastName,
      phoneNumber,
      email
    }: UpdateTransactionBody
  ): Promise<ITransaction | null> => {
    //  Check user is one of the sides of the transaction
    const [transactionCurrentSide, transactionOtherSide] = await transactionSideHelper.getTransactionSidesByUserId(
      transactionId,
      user.id
    )

    if (!transactionCurrentSide || !transactionCurrentSide.isCreator) {
      return null
    }

    const activeStage = (await transactionStageHelper.getActiveStage(transactionId))[0]

    if (
      _.isNil(activeStage) ||
      ![
        TransactionStageName.Draft,
        TransactionStageName.AuthorizationSideA,
        TransactionStageName.AuthorizationSideAConfirmation,
        TransactionStageName.ConfirmationSideB
      ].includes(activeStage.name)
    ) {
      return null
    }

    const updatedFields: Record<string, any> = {}

    if (amount) {
      const commissionObject = await getCommissionByAmount(amount)

      updatedFields.amount = amount
      updatedFields.commissionId = commissionObject.commissionId
      updatedFields.commissionAmount = commissionObject.amount
    }

    if (properties) {
      await upsertProductProperties(transactionId, properties)
    }

    let transactionSides: ITransactionSide[] | null = null
    if (firstName || lastName || email || phoneNumber || creatorSide) {
      if (transactionOtherSide && transactionOtherSide.user.phoneNumber === phoneNumber) {
        transactionSides = await transactionSideHelper.updateTransactionSideB(
          transactionId,
          user,
          transactionOtherSide.user,
          firstName,
          lastName,
          email,
          phoneNumber,
          creatorSide
        )
      } else if (transactionOtherSide) {
        if (_.isNil(firstName) || _.isNil(lastName) || _.isNil(email) || _.isNil(phoneNumber) || _.isNil(creatorSide)) {
          return null
        }

        await transactionSideHelper.deleteTransactionSideB(transactionId, transactionOtherSide.id)
        transactionSides = await transactionSideHelper.createTransactionSideB(
          transactionId,
          user.id,
          firstName,
          lastName,
          email,
          phoneNumber,
          creatorSide
        )
      } else {
        if (_.isNil(firstName) || _.isNil(lastName) || _.isNil(email) || _.isNil(phoneNumber) || _.isNil(creatorSide)) {
          return null
        }

        transactionSides = await transactionSideHelper.createTransactionSideB(
          transactionId,
          user.id,
          firstName,
          lastName,
          email,
          phoneNumber,
          creatorSide
        )
      }
    }
    if (
      !_.isNil(productCategoryId) ||
      !_.isNil(productCategoryOther) ||
      !_.isNil(productSubcategoryId) ||
      !_.isNil(productSubcategoryOther) ||
      !_.isNil(currency) ||
      !_.isNil(endDate) ||
      !_.isNil(commissionPayer) ||
      !_.isNil(productCategoryId) ||
      Object.keys(updatedFields).length !== 0
    ) {
      await transactionModel.updateTransactions(
        { id: transactionId },
        {
          productCategoryId,
          productCategoryOther,
          productSubcategoryId,
          productSubcategoryOther,
          amountCurrency: currency,
          commissionAmountCurrency: currency,
          endDate,
          commissionPayer,
          ...updatedFields
        }
      )
    }

    return await transactionHelper.getFullTransaction({
      transactionId,
      sides:
        transactionSides ??
        (transactionOtherSide !== undefined ? [transactionCurrentSide, transactionOtherSide] : [transactionCurrentSide])
    })
  },
  userCancelTransaction: async (user: IUser, transactionId: number): Promise<ITransaction | null> => {
    const transactionSides = await transactionSideHelper.getTransactionSidesByUserId(transactionId, user.id)

    if (!transactionSides[0] || !transactionSides[0].isCreator) {
      return null
    }

    const activeStage = (await transactionStageHelper.getActiveStage(transactionId))[0]

    if (
      _.isNil(activeStage) ||
      ![
        TransactionStageName.Draft,
        TransactionStageName.AuthorizationSideA,
        TransactionStageName.AuthorizationSideAConfirmation,
        TransactionStageName.ConfirmationSideB
      ].includes(activeStage.name)
    ) {
      return null
    }

    const canceledTransaction = (
      await transactionModel.updateTransactions(
        { id: transactionId },
        {
          status: TransactionStatus.Canceled
        }
      )
    )[0]

    globalHelper.sendEmailTrigger(
      EmailTemplateName.TRANSACTION_CANCEL,
      [...transactionSides.filter((side) => side).map((side) => side!.user.email), EmailService.defaultMailSender],
      `${EmailTemplateName.TRANSACTION_CANCEL}`
    )

    return canceledTransaction
  },
  adminCancelTransaction: async (transactionId: number): Promise<ITransaction | null> => {
    const transactionSides = await transactionSideModel.getTransactionSides({
      [`${Tables.TRANSACTION_SIDES}.transaction_id`]: transactionId
    })

    const canceledTransaction = (
      await transactionModel.updateTransactions(
        { id: transactionId },
        {
          status: TransactionStatus.Canceled
        }
      )
    )[0]

    globalHelper.sendEmailTrigger(
      EmailTemplateName.TRANSACTION_CANCEL,
      [...transactionSides.map((side) => side!.user.email), EmailService.defaultMailSender],
      `${EmailTemplateName.TRANSACTION_CANCEL}`
    )

    return canceledTransaction
  },
  isTransactionCompleted: async (transactionId: number): Promise<boolean> => {
    const transaction = (
      await transactionModel.getTransactions({
        [`${Tables.TRANSACTIONS}.id`]: transactionId
      })
    )[0]

    //  Check basic transaction props
    if (
      _.isNil(transaction.amountCurrency) ||
      _.isNil(transaction.amount) ||
      _.isNil(transaction.commissionAmountCurrency) ||
      _.isNil(transaction.commissionAmount) ||
      _.isNil(transaction.commission) ||
      _.isNil(transaction.commissionPayer) ||
      _.isNil(transaction.endDate) ||
      _.isNil(transaction.productCategory) ||
      (transaction.productCategory.name === 'other' && _.isNil(transaction.productCategoryOther)) ||
      (transaction.productCategory.name === 'cars' &&
        (_.isNil(transaction.productSubcategory) ||
          (transaction.productSubcategory.name === 'other' && _.isNil(transaction.productSubcategoryOther))))
    ) {
      return false
    }
    //  Check product properties
    const productProperties = await productPropertyModel.getAllProductProperties({
      productCategoryId: transaction.productCategory.id
    })
    const transactionProductProperties = await transactionProductPropertyModel.getAllTransactionProductProperties({
      productCategoryId: transaction.productCategory.id,
      [`${Tables.TRANSACTION_PRODUCT_PROPERTIES}.transaction_id`]: transactionId
    })

    if (
      !productProperties.every(
        (productProperty) =>
          transactionProductProperties.findIndex(
            (transactionProductProperty) => transactionProductProperty.property.id === productProperty.id
          ) !== -1
      )
    ) {
      return false
    }
    //  Check sides
    const transactionSides = await transactionSideModel.getTransactionSides({
      [`${Tables.TRANSACTION_SIDES}.transaction_id`]: transactionId
    })

    if (transactionSides.length !== 2) {
      return false
    }
    return true
  },
  getFullTransaction: async ({
    transactionId,
    properties,
    sides,
    stages,
    disputes
  }: {
    transactionId: number
    properties?: ITransactionProductProperty[]
    sides?: ITransactionSide[]
    stages?: ITransactionStage[]
    disputes?: ITransactionDispute[]
  }): Promise<ITransaction | null> => {
    let transactionStages = stages
    let transactionProperties = properties
    let transactionDisputes = disputes
    let transactionSides = sides

    const transaction = (
      await transactionModel.getTransactions({
        [`${Tables.TRANSACTIONS}.id`]: transactionId
      })
    )[0]

    if (!transaction) {
      return null
    }

    if (!transactionStages)
      transactionStages = await transactionStageModel.getTransactionStages({
        [`${Tables.TRANSACTION_STAGES}.transaction_id`]: transaction.id
      })

    if (!transactionProperties) {
      transactionProperties = await transactionProductPropertyModel.getAllTransactionProductProperties({
        [`${Tables.TRANSACTION_PRODUCT_PROPERTIES}.transaction_id`]: transaction.id
      })
    }
    if (!transactionDisputes) {
      transactionDisputes = await transactionDisputeModel.getTransactionDisputes({
        transaction_id: transaction.id
      })
    }
    if (!transactionSides) {
      transactionSides = await transactionSideModel.getTransactionSides({
        [`${Tables.TRANSACTION_SIDES}.transaction_id`]: transaction.id
      })
    }
    transaction.stages = transactionStages
    transaction.properties = transactionProperties
    transaction.disputes = transactionDisputes
    transaction.sides = transactionSides
    return transaction
  },
  getFullTransactions: async ({
    userId = 0,
    condition
  }: {
    userId?: number
    condition?: string
  }): Promise<ITransaction[]> => {
    const term = condition ? condition : { [`${Tables.USERS}.id`]: userId }
    const transactions = await transactionModel.getTransactions(term)

    if (transactions.length === 0) {
      return []
    }

    const transactionIds: number[] = transactions.map((transaction) => transaction.id)

    const stages = await transactionStageModel.getTransactionStages(
      `${Tables.TRANSACTION_STAGES}.transaction_id IN (${transactionIds})`
    )

    const properties = await transactionProductPropertyModel.getAllTransactionProductProperties(
      `${Tables.TRANSACTION_PRODUCT_PROPERTIES}.transaction_id IN (${transactionIds})`
    )

    const disputes = await transactionDisputeModel.getTransactionDisputes(`transaction_id IN (${transactionIds})`)

    const sides = await transactionSideModel.getTransactionSides(
      `${Tables.TRANSACTION_SIDES}.transaction_id IN (${transactionIds})`
    )

    for (const transaction of transactions) {
      transaction.properties = properties.filter((property) => property.transactionId === transaction.id)
      transaction.sides = sides.filter((side) => side.transactionId === transaction.id)
      transaction.stages = stages.filter((stage) => stage.transactionId === transaction.id)
      transaction.disputes = disputes.filter((dispute) => dispute.transactionId === transaction.id)
    }
    return transactions
  },
  getPendingAuthTransactions: async (userId: number): Promise<ITransaction[]> => {
    const transactions = await transactionModel.getTransactions(
      `${Tables.USERS}.id = '${userId}' AND ${Tables.TRANSACTIONS}.status = 'stage' AND ${Tables.TRANSACTION_STAGES}.status = 'active' AND ${Tables.TRANSACTION_STAGES}.name IN ('authorizationSideA', 'authorizationSideB')`
    )
    return transactions
  },
  getPendingAuthConfirmationTransactions: async (accountId: number): Promise<ITransaction[]> => {
    const transactions = await transactionModel.getTransactions(
      `${Tables.ACCOUNTS}.id = '${accountId}' AND ${Tables.TRANSACTIONS}.status = 'stage' AND ${Tables.TRANSACTION_STAGES}.status = 'active' AND ${Tables.TRANSACTION_STAGES}.name IN ('authorizationSideAConfirmation', 'authorizationSideBConfirmation')`
    )
    return transactions
  },
  cancelAllActiveTransactions: async (accountId: number): Promise<ITransaction[]> => {
    const transactions = await transactionModel.getTransactions(
      `${Tables.ACCOUNTS}.id = '${accountId}' AND ${Tables.TRANSACTIONS}.status IN ('dispute', 'stage')`
    )
    await transactionModel.updateTransactions(`id IN (${transactions.map((transaction) => transaction.id)})`, {
      status: TransactionStatus.Canceled,
      cancelReason: 'Authorization failure'
    })
    return transactions
  },
  getAllActiveTransactions: (accountId: number): Promise<ITransaction[]> => {
    return transactionModel.getTransactions(
      `${Tables.ACCOUNTS}.id = '${accountId}' AND ${Tables.TRANSACTIONS}.status IN ('dispute', 'stage')`
    )
  }
}

const getCommissionByAmount = async (amount: number): Promise<{ commissionId: number | null; amount: number }> => {
  const commissions = await commissionModel.getCommissions({
    isActive: true
  })

  return commissionCalculate(commissions, amount)
}

const upsertProductProperties = async (
  transactionId: number,
  properties: CreateTransactionBodyProductProperty[]
): Promise<void> => {
  for (const property of properties) {
    let transactionProductProperty = await transactionProductPropertyModel.getTransactionProductProperty({
      [`${Tables.PRODUCT_PROPERTIES}.id`]: property.productPropertyId,
      [`${Tables.TRANSACTION_PRODUCT_PROPERTIES}.transaction_id`]: transactionId
    })
    if (transactionProductProperty) {
      if (property.files) {
        const existingFiles = await fileModel.getFiles({
          rowId: transactionProductProperty.id,
          tableName: Tables.TRANSACTION_PRODUCT_PROPERTIES
        })
        const filesToDelete = existingFiles.filter(
          (existingFile) => property.files?.findIndex((propertyFile) => propertyFile === existingFile.url) === -1
        )

        if (filesToDelete.length > 0) {
          await fileModel.removeFiles(`id IN (${filesToDelete.map((fileToDelete) => fileToDelete.id)})`)
        }

        for (const propertyFile of property.files) {
          fileModel.updateFiles(
            { url: propertyFile },
            { rowId: transactionProductProperty.id, tableName: Tables.TRANSACTION_PRODUCT_PROPERTIES }
          )
        }
      } else {
        await transactionProductPropertyModel.updateTransactionProductProperty(
          {
            value: property.value ?? JSON.stringify(property.files)
          },
          {
            id: transactionProductProperty.id
          }
        )
      }

      continue
    }
    transactionProductProperty = await transactionProductPropertyModel.createTransactionProductProperty({
      transactionId,
      productPropertyId: property.productPropertyId,
      value: property.value
    })

    if (property.files) {
      for (const file of property.files) {
        fileModel.updateFiles(
          { url: file },
          { rowId: transactionProductProperty.id, tableName: Tables.TRANSACTION_PRODUCT_PROPERTIES }
        )
      }
    }
  }
}

export default transactionHelper
