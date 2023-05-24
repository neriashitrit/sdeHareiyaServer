import _ from 'lodash'
import { IUserAccount } from 'safe-shore-common'

import { Tables } from '../constants'
import DbService from '../services/db.service'
import { getJsonBuildObject } from '../utils/db.utils'

const db = new DbService()

export const userAccountModel = {
  getUserAccount: async (condition: Record<string, any>): Promise<IUserAccount | undefined> => {
    try {
      const userAccount = await db.knex
        .queryBuilder()
        .select(
          `${Tables.USER_ACCOUNTS}.id`,
          `${Tables.USER_ACCOUNTS}.created_at`,
          `${Tables.USER_ACCOUNTS}.updated_at`,
          db.knex.raw(`JSON_BUILD_OBJECT(${getJsonBuildObject(Tables.USERS, [Tables.USERS])}) as user`),
          db.knex.raw(
            `JSON_BUILD_OBJECT(${getJsonBuildObject(Tables.ACCOUNTS, [
              Tables.ACCOUNTS,
              Tables.BANK_DETAILS
            ])}) as account`
          )
        )
        .from(Tables.USER_ACCOUNTS)
        .where(condition)
        .leftJoin(Tables.ACCOUNTS, `${Tables.USER_ACCOUNTS}.account_id`, `${Tables.ACCOUNTS}.id`)
        .leftJoin(Tables.BANK_DETAILS, `${Tables.BANK_DETAILS}.account_id`, `${Tables.ACCOUNTS}.id`)
        .leftJoin(Tables.USERS, `${Tables.USER_ACCOUNTS}.user_id`, `${Tables.USERS}.id`)
        .groupBy(
          `${Tables.USER_ACCOUNTS}.id`,
          `${Tables.USERS}.id`,
          `${Tables.ACCOUNTS}.id`,
          `${Tables.BANK_DETAILS}.id`
        )
        .first()

      return userAccount
    } catch (error) {
      console.error('ERROR in UserAccounts.modal getUserAccount()', error.message)
      throw {
        message: `error while trying to getUserAccount. error: ${error.message}`
      }
    }
  },
  createUserAccount: async (newUserAccount: Record<string, string | number | boolean>): Promise<IUserAccount> => {
    try {
      const userAccount = await db.insert(Tables.USER_ACCOUNTS, newUserAccount)
      return userAccount?.[0]
    } catch (error) {
      console.error('ERROR in UserAccounts.modal createUserAccount()', error.message)
      throw {
        message: `error while trying to createUserAccount. error: ${error.message}`
      }
    }
  }
}
