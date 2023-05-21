import _ from 'lodash'
import { ITransactionStage } from 'safe-shore-common'

import { Tables } from '../constants'
import DbService from '../services/db.service'
import { getJsonBuildObject } from '../utils/db.utils'

const db = new DbService()

export const transactionStageModel = {
  getTransactionStages: async (condition: Record<string, any> | string): Promise<ITransactionStage[]> => {
    try {
      let parsedCondition = condition
      if (typeof condition === 'string') {
        parsedCondition = db.knex.raw(condition)
      }
      const transactionStage = await db.knex
        .queryBuilder()
        .select(
          `${Tables.TRANSACTION_STAGES}.id`,
          `${Tables.TRANSACTION_STAGES}.name`,
          `${Tables.TRANSACTION_STAGES}.inCharge`,
          `${Tables.TRANSACTION_STAGES}.status`,
          `${Tables.TRANSACTION_STAGES}.transaction_id`,
          `${Tables.TRANSACTION_STAGES}.created_at`,
          `${Tables.TRANSACTION_STAGES}.updated_at`,

          db.knex.raw(`JSON_BUILD_OBJECT(${getJsonBuildObject(Tables.USERS, [Tables.USERS])}) as user`)
        )
        .from(Tables.TRANSACTION_STAGES)
        .leftJoin(Tables.USERS, `${Tables.TRANSACTION_STAGES}.user_id`, `${Tables.USERS}.id`)
        .where(parsedCondition)
        .groupBy(`${Tables.TRANSACTION_STAGES}.id`, `${Tables.USERS}.id`)

      return transactionStage
    } catch (error) {
      console.error('ERROR in transaction_stages.modal getTransactionStages()', error.message)
      throw {
        message: `error while trying to getTransactionStages. error: ${error.message}`
      }
    }
  },
  createTransactionStage: async (newTransactionStage: Record<string, any>): Promise<ITransactionStage> => {
    try {
      const transactionStage = await db.insert(Tables.TRANSACTION_STAGES, newTransactionStage)
      return transactionStage?.[0]
    } catch (error) {
      console.error('ERROR in transaction_stages.modal createTransactionStage()', error.message)
      throw {
        message: `error while trying to createTransactionStage. error: ${error.message}`
      }
    }
  },
  updateTransactionStage: async (
    condition: Record<string, any>,
    updatedTransactionStage: Record<string, any>
  ): Promise<ITransactionStage | undefined> => {
    try {
      const transactionStage = await db.update(Tables.TRANSACTION_STAGES, updatedTransactionStage, condition)
      return transactionStage?.[0]
    } catch (error) {
      console.error('ERROR in transaction_stages.modal updateTransactionStage()', error.message)
      throw {
        message: `error while trying to updateTransactionStage. error: ${error.message}`
      }
    }
  }
}
