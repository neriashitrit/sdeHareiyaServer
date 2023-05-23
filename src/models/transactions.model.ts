import _ from 'lodash'
import { types } from 'pg'
import { ITransaction, IUser, TransactionStageName, TransactionStageStatus, TransactionStatus } from 'safe-shore-common'

import { Tables } from '../constants'
import DbService from '../services/db.service'
import { buildRange, getJsonBuildObject } from '../utils/db.utils'

types.setTypeParser(20, 'text', parseInt)
const db = new DbService()

export const transactionModel = {
  getTransactions: async (condition: Record<string, any> | string): Promise<ITransaction[]> => {
    try {
      let parsedCondition = condition
      if (typeof condition === 'string') {
        parsedCondition = db.knex.raw(condition)
      }
      const transaction = await db.knex
        .queryBuilder()
        .select([
          `${Tables.TRANSACTIONS}.id`,
          `${Tables.TRANSACTIONS}.status`,
          `${Tables.TRANSACTIONS}.product_category_other`,
          `${Tables.TRANSACTIONS}.product_subcategory_other`,
          `${Tables.TRANSACTIONS}.amount_currency`,
          `${Tables.TRANSACTIONS}.amount`,
          `${Tables.TRANSACTIONS}.commission_payer`,
          `${Tables.TRANSACTIONS}.commission_amount_currency`,
          `${Tables.TRANSACTIONS}.commission_amount`,
          `${Tables.TRANSACTIONS}.end_date`,
          `${Tables.TRANSACTIONS}.cancel_reason`,
          `${Tables.TRANSACTIONS}.cancel_reason_other`,
          `${Tables.TRANSACTIONS}.deposit_bank_name`,
          `${Tables.TRANSACTIONS}.deposit_bank_number`,
          `${Tables.TRANSACTIONS}.deposit_bank_account_owner_full_name`,
          `${Tables.TRANSACTIONS}.deposit_transfer_date`,
          `${Tables.TRANSACTIONS}.deposit_reference_number`,
          'deposit_reference_file_url.url AS deposit_reference_file_url',
          `${Tables.TRANSACTIONS}.created_at`,
          `${Tables.TRANSACTIONS}.updated_at`,
          db.knex.raw(
            `JSON_BUILD_OBJECT(${getJsonBuildObject(Tables.PRODUCT_CATEGORIES, [
              Tables.PRODUCT_CATEGORIES,
              'product_category_file'
            ])}) AS product_category`
          ),
          db.knex.raw(
            `CASE WHEN ${Tables.PRODUCT_SUBCATEGORIES}.id IS NULL THEN null ELSE JSON_BUILD_OBJECT(${getJsonBuildObject(
              Tables.PRODUCT_SUBCATEGORIES,
              [Tables.PRODUCT_SUBCATEGORIES, 'product_subcategory_file']
            )}) END AS product_subcategory`
          ),
          db.knex.raw(
            `JSON_BUILD_OBJECT(${getJsonBuildObject(Tables.COMMISSIONS, [Tables.COMMISSIONS])})  AS commission	`
          )
        ])
        .from(Tables.TRANSACTIONS)
        .leftJoin(
          Tables.PRODUCT_CATEGORIES,
          `${Tables.PRODUCT_CATEGORIES}.id`,
          `${Tables.TRANSACTIONS}.product_category_id`
        )
        .leftJoin(`${Tables.FILES} AS product_category_file`, function () {
          this.on(`${Tables.PRODUCT_CATEGORIES}.id`, 'product_category_file.row_id').andOn(
            'product_category_file.table_name',
            db.knex.raw('?', [Tables.PRODUCT_CATEGORIES])
          )
        })
        .leftJoin(
          Tables.PRODUCT_SUBCATEGORIES,
          `${Tables.PRODUCT_SUBCATEGORIES}.id`,
          `${Tables.TRANSACTIONS}.product_subcategory_id`
        )
        .leftJoin(`${Tables.FILES} AS product_subcategory_file`, function () {
          this.on(`${Tables.PRODUCT_SUBCATEGORIES}.id`, 'product_subcategory_file.row_id').andOn(
            'product_subcategory_file.table_name',
            db.knex.raw(`'${Tables.PRODUCT_SUBCATEGORIES}'`)
          )
        })
        .leftJoin(Tables.COMMISSIONS, `${Tables.TRANSACTIONS}.commission_id`, `${Tables.COMMISSIONS}.id`)
        .leftJoin(`${Tables.FILES} AS deposit_reference_file_url`, function () {
          this.on(`${Tables.TRANSACTIONS}.id`, 'deposit_reference_file_url.row_id').andOn(
            'deposit_reference_file_url.table_name',
            db.knex.raw(`'${Tables.TRANSACTIONS}'`)
          )
        })
        .leftJoin(Tables.TRANSACTION_SIDES, `${Tables.TRANSACTION_SIDES}.transaction_id`, `${Tables.TRANSACTIONS}.id`)
        .leftJoin(Tables.USER_ACCOUNTS, `${Tables.USER_ACCOUNTS}.id`, `${Tables.TRANSACTION_SIDES}.user_account_id`)
        .leftJoin(Tables.USERS, `${Tables.USERS}.id`, `${Tables.USER_ACCOUNTS}.user_id`)
        .leftJoin(Tables.ACCOUNTS, `${Tables.ACCOUNTS}.id`, `${Tables.USER_ACCOUNTS}.account_id`)
        .leftJoin(Tables.TRANSACTION_STAGES, `${Tables.TRANSACTION_STAGES}.transaction_id`, `${Tables.TRANSACTIONS}.id`)
        .where(parsedCondition)
        .groupBy(
          `${Tables.TRANSACTIONS}.id`,
          `${Tables.COMMISSIONS}.id`,
          `${Tables.PRODUCT_SUBCATEGORIES}.id`,
          `${Tables.PRODUCT_CATEGORIES}.id`,
          'product_category_file.id',
          'product_subcategory_file.id',
          'deposit_reference_file_url.id'
        )
      return transaction
    } catch (error) {
      console.error('ERROR in transactionDispute.modal getTransactionDisputes()', error.message)
      throw {
        message: `error while trying to getTransactionDisputes. error: ${error.message}`
      }
    }
  },
  createTransaction: async (newTransaction: Record<string, any>): Promise<ITransaction> => {
    try {
      const transaction = await db.insert(Tables.TRANSACTIONS, newTransaction)
      return transaction?.[0]
    } catch (error) {
      console.error('ERROR in transactions.modal createTransaction()', error.message)
      throw {
        message: `error while trying to createTransaction. error: ${error.message}`
      }
    }
  },
  updateTransaction: async (
    condition: Record<string, any> | string,
    updatedTransaction: Record<string, any>
  ): Promise<void> => {
    try {
      let parsedCondition = condition
      if (typeof condition === 'string') {
        parsedCondition = db.knex.raw(condition)
      }
      await db.knex(Tables.TRANSACTIONS).where(parsedCondition).update(updatedTransaction)
    } catch (error) {
      console.error('ERROR in transactions.modal updateTransaction()', error.message)
      throw {
        message: `error while trying to updateTransaction. error: ${error.message}`
      }
    }
  },
  getTransactionsAmountSumLastHalfYear: async (accountId: number): Promise<number> => {
    try {
      const sum = await db.knex
        .queryBuilder()
        .select(db.knex.raw(`SUM(${Tables.TRANSACTIONS}.amount) AS total_amount`))
        .from(Tables.TRANSACTIONS)
        .leftJoin(
          Tables.TRANSACTION_SIDES,
          `${Tables.TRANSACTIONS}.id`,

          `${Tables.TRANSACTION_SIDES}.transaction_id`
        )
        .leftJoin(Tables.USER_ACCOUNTS, `${Tables.TRANSACTION_SIDES}.user_account_id`, `${Tables.USER_ACCOUNTS}.id`)
        .leftJoin(Tables.ACCOUNTS, `${Tables.USER_ACCOUNTS}.account_id`, `${Tables.ACCOUNTS}.id`)
        .leftJoin(Tables.TRANSACTION_STAGES, `${Tables.TRANSACTIONS}.id`, `${Tables.TRANSACTION_STAGES}.transaction_id`)
        .where(db.knex.raw(`${Tables.TRANSACTIONS}.created_at > (NOW() - INTERVAL '6 months')`))
        .andWhere(db.knex.raw(`${Tables.TRANSACTIONS}.status != 'canceled'`))
        .andWhere(db.knex.raw(`${Tables.TRANSACTION_STAGES}.status = 'active'`))
        .andWhere(db.knex.raw(`${Tables.TRANSACTION_STAGES}.name != 'draft'`))
        .andWhere(db.knex.raw(`${Tables.ACCOUNTS}.id = '${accountId}'`))

      return sum[0].totalAmount as unknown as number
    } catch (error) {
      console.error('ERROR in transaction_stages.modal getTransactionsAmountSumLastHalfYear()', error.message)
      throw {
        message: `error while trying to getTransactionsAmountSumLastHalfYear. error: ${error.message}`
      }
    }
  },
  getTransactionsStatusAnalytics: async (startDate?: string, endDate?: string) => {
    try {
      const analytics = await db.knex
        .select(`${Tables.TRANSACTIONS}.status`)
        .from(Tables.TRANSACTIONS)
        .count(`${Tables.TRANSACTIONS}.status AS total`)
        .sum(`${Tables.TRANSACTIONS}.amount AS amount`)
        .sum(`${Tables.TRANSACTIONS}.commission_amount AS commission_amount`)
        .whereNot(`${Tables.TRANSACTIONS}.status`,TransactionStatus.Stage)
        .modify((queryBuilder) => {
          buildRange(queryBuilder, `${Tables.TRANSACTIONS}.updated_at`, startDate, endDate)
        })
        .groupBy(`${Tables.TRANSACTIONS}.status`)

        const analyticsStages = await db.knex
        .select(`${Tables.TRANSACTIONS}.status`,`${Tables.TRANSACTION_STAGES}.name`)
        .from(Tables.TRANSACTIONS)
        .count(`${Tables.TRANSACTIONS}.status AS total`)
        .sum(`${Tables.TRANSACTIONS}.amount AS amount`)
        .sum(`${Tables.TRANSACTIONS}.commission_amount AS commission_amount`)
        .where(`${Tables.TRANSACTIONS}.status`,TransactionStatus.Stage)
        .where(`${Tables.TRANSACTION_STAGES}.status`,TransactionStageStatus.Active)
        .whereNot(`${Tables.TRANSACTION_STAGES}.name`,TransactionStageName.Completed)
        .leftJoin(Tables.TRANSACTION_STAGES, `${Tables.TRANSACTION_STAGES}.transaction_id`, `${Tables.TRANSACTIONS}.id`)
        .modify((queryBuilder) => {
          buildRange(queryBuilder, `${Tables.TRANSACTIONS}.updated_at`, startDate, endDate)
        })
        
        .groupBy(`${Tables.TRANSACTIONS}.status`, `${Tables.TRANSACTION_STAGES}.name`)
      return [...analytics,...analyticsStages]
    } catch (error) {
      console.error('ERROR in transactionModel.modal getTransactionsStatusAnalytics()', error.message)
      throw {
        message: `error while trying to getTransactionsStatusAnalytics. error: ${error.message}`
      }
    }
  },
  getTransactionsProductsAnalytics: async (startDate?: string, endDate?: string) => {
    try {
      const analytics = await db.knex
        .select(
          `${Tables.TRANSACTIONS}.product_category_id`,
          `${Tables.TRANSACTIONS}.product_category_other`,
          `${Tables.PRODUCT_CATEGORIES}.name AS productName`
        )
        .count(`${Tables.TRANSACTIONS}.id AS total`)
        .from(Tables.TRANSACTIONS)
        .leftJoin(
          Tables.PRODUCT_CATEGORIES,
          `${Tables.PRODUCT_CATEGORIES}.id`,
          `${Tables.TRANSACTIONS}.product_category_id`
        )
        .modify((queryBuilder) => {
          buildRange(queryBuilder, `${Tables.TRANSACTIONS}.updated_at`, startDate, endDate)
        })
        .groupBy(
          `${Tables.TRANSACTIONS}.product_category_id`,
          `${Tables.TRANSACTIONS}.product_category_other`,
          `${Tables.PRODUCT_CATEGORIES}.name`
        )
      return analytics
    } catch (error) {
      console.error('ERROR in transactionModel.modal getTransactionsProductsAnalytics()', error.message)
      throw {
        message: `error while trying to getTransactionsProductsAnalytics. error: ${error.message}`
      }
    }
  }
}
