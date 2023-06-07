import _ from 'lodash'
import { ITransactionSide } from 'safe-shore-common'

import { Tables } from '../constants'
import DbService from '../services/db.service'
import { getJsonBuildObject } from '../utils/db.utils'

const db = new DbService()

export const transactionSideModel = {
  getTransactionSides: async (condition: Record<string, any> | string): Promise<ITransactionSide[]> => {
    try {
      let parsedCondition = condition
      if (typeof condition === 'string') {
        parsedCondition = db.knex.raw(condition)
      }
      const result = await db.knex
        .queryBuilder()
        .select(
          `${Tables.TRANSACTION_SIDES}.id`,
          `${Tables.TRANSACTION_SIDES}.side`,
          `${Tables.TRANSACTION_SIDES}.transaction_id`,
          `${Tables.TRANSACTION_SIDES}.created_at`,
          `${Tables.TRANSACTION_SIDES}.updated_at`,
          `${Tables.TRANSACTION_SIDES}.is_creator`,
          db.knex.raw(
            `CASE WHEN ${Tables.BANK_DETAILS}.id IS NULL THEN null ELSE JSON_BUILD_OBJECT(${getJsonBuildObject(
              Tables.BANK_DETAILS,
              [Tables.BANK_DETAILS, Tables.ACCOUNTS]
            )}) END as bank_details`
          ),
          db.knex.raw(`JSON_BUILD_OBJECT(${getJsonBuildObject(Tables.USERS, [Tables.USERS])}) as user`),
          db.knex.raw(`JSON_BUILD_OBJECT(${getJsonBuildObject(Tables.ACCOUNTS, [Tables.ACCOUNTS])}) as account`)
        )
        .from(Tables.TRANSACTION_SIDES)
        .leftJoin(Tables.BANK_DETAILS, `${Tables.TRANSACTION_SIDES}.bank_details_id`, `${Tables.BANK_DETAILS}.id`)
        .leftJoin(Tables.USER_ACCOUNTS, `${Tables.TRANSACTION_SIDES}.user_account_id`, `${Tables.USER_ACCOUNTS}.id`)
        .leftJoin(Tables.USERS, `${Tables.USER_ACCOUNTS}.user_id`, `${Tables.USERS}.id`)
        .leftJoin(Tables.ACCOUNTS, `${Tables.USER_ACCOUNTS}.account_id`, `${Tables.ACCOUNTS}.id`)
        .where(parsedCondition)
        .groupBy(
          `${Tables.TRANSACTION_SIDES}.id`,
          `${Tables.USER_ACCOUNTS}.id`,
          `${Tables.BANK_DETAILS}.id`,
          `${Tables.USERS}.id`,
          `${Tables.ACCOUNTS}.id`
        )

      return result
    } catch (error) {
      console.error('ERROR in transactionSide.modal getTransactionSides()', error.message)
      throw {
        message: `error while trying to getTransactionSides. error: ${error.message}`
      }
    }
  },
  createTransactionSide: async (newTransactionSide: Record<string, any>): Promise<ITransactionSide> => {
    try {
      const transactionSide = await db.insert(Tables.TRANSACTION_SIDES, newTransactionSide)
      return transactionSide?.[0]
    } catch (error) {
      console.error('ERROR in transactionSide.modal createTransactionSide()', error.message)
      throw {
        message: `error while trying to createTransactionSide. error: ${error.message}`
      }
    }
  },
  updateTransactionSide: async (
    condition: Record<string, any> | string,
    updatedTransactionSide: Record<string, any>
  ): Promise<ITransactionSide | undefined> => {
    try {
      let parsedCondition = condition
      if (typeof condition === 'string') {
        parsedCondition = db.knex.raw(condition)
      }
      const transactionSide = await db.update(Tables.TRANSACTION_SIDES, updatedTransactionSide, parsedCondition)
      return transactionSide?.[0]
    } catch (error) {
      console.error('ERROR in transactionSide.modal updateTransactionSide()', error.message)
      throw {
        message: `error while trying to updateTransactionSide. error: ${error.message}`
      }
    }
  },
  deleteTransactionSide: async (condition: Record<string, any> | string): Promise<void> => {
    try {
      let parsedCondition = condition
      if (typeof condition === 'string') {
        parsedCondition = db.knex.raw(condition)
      }
      await db.delete(Tables.TRANSACTION_SIDES, parsedCondition)
      return
    } catch (error) {
      console.error('ERROR in transactionSide.modal deleteTransactionSide()', error.message)
      throw {
        message: `error while trying to deleteTransactionSide. error: ${error.message}`
      }
    }
  }
}
