import _ from 'lodash'
import { ITransactionProductProperty } from 'safe-shore-common'

import { Tables } from '../constants'
import DbService from '../services/db.service'
import { getJsonBuildObject } from '../utils/db.utils'

const db = new DbService()

export const transactionProductPropertyModel = {
  getTransactionProductProperty: async (
    condition: Record<string, any> | string
  ): Promise<ITransactionProductProperty | undefined> => {
    try {
      const transactionProductProperties = await db.knex
        .queryBuilder()
        .select(
          `${Tables.TRANSACTION_PRODUCT_PROPERTIES}.id`,
          `${Tables.TRANSACTION_PRODUCT_PROPERTIES}.value`,
          `${Tables.TRANSACTION_PRODUCT_PROPERTIES}.transaction_id`,
          db.knex.raw(
            `JSON_BUILD_OBJECT(${getJsonBuildObject(Tables.PRODUCT_PROPERTIES, [
              Tables.PRODUCT_PROPERTIES
            ])}) as property`
          )
        )
        .from(Tables.TRANSACTION_PRODUCT_PROPERTIES)
        .where(condition)
        .leftJoin(
          Tables.PRODUCT_PROPERTIES,
          `${Tables.TRANSACTION_PRODUCT_PROPERTIES}.product_property_id`,
          `${Tables.PRODUCT_PROPERTIES}.id`
        )
        .groupBy(`${Tables.TRANSACTION_PRODUCT_PROPERTIES}.id`, `${Tables.PRODUCT_PROPERTIES}.id`)
        .first()

      return transactionProductProperties
    } catch (error) {
      console.error('ERROR in transactionProductPropertyModel.modal getTransactionProductProperty()', error.message)
      throw {
        message: `error while trying to getTransactionProductProperty. error: ${error.message}`
      }
    }
  },
  getAllTransactionProductProperties: async (
    condition: Record<string, any> | string
  ): Promise<ITransactionProductProperty[]> => {
    try {
      let parsedCondition = condition
      if (typeof condition === 'string') {
        parsedCondition = db.knex.raw(condition)
      }
      const transactionProductProperties = await db.knex
        .queryBuilder()
        .select(
          `${Tables.TRANSACTION_PRODUCT_PROPERTIES}.id`,
          `${Tables.TRANSACTION_PRODUCT_PROPERTIES}.value`,
          `${Tables.TRANSACTION_PRODUCT_PROPERTIES}.transaction_id`,
          db.knex.raw(
            `JSON_BUILD_OBJECT(${getJsonBuildObject(Tables.PRODUCT_PROPERTIES, [
              Tables.PRODUCT_PROPERTIES
            ])}) as property`
          ),
          // db.knex.raw(`JSON_AGG(${Tables.FILES}.url) as files`)

          db.knex.raw(
            `CASE WHEN MAX(${Tables.FILES}.id) IS NULL THEN null ELSE JSON_AGG(${Tables.FILES}.url) END as files`
          )
        )
        .from(Tables.TRANSACTION_PRODUCT_PROPERTIES)
        .where(parsedCondition)
        .leftJoin(
          Tables.PRODUCT_PROPERTIES,
          `${Tables.TRANSACTION_PRODUCT_PROPERTIES}.product_property_id`,
          `${Tables.PRODUCT_PROPERTIES}.id`
        )
        .leftJoin(Tables.FILES, function () {
          this.on(`${Tables.TRANSACTION_PRODUCT_PROPERTIES}.id`, `${Tables.FILES}.row_id`).andOn(
            `${Tables.FILES}.table_name`,
            db.knex.raw(`'${Tables.TRANSACTION_PRODUCT_PROPERTIES}'`)
          )
        })
        .groupBy(`${Tables.TRANSACTION_PRODUCT_PROPERTIES}.id`, `${Tables.PRODUCT_PROPERTIES}.id`)

      return transactionProductProperties
    } catch (error) {
      console.error('ERROR in transactionProductPropertyModel.modal getTransactionProductProperty()', error.message)
      throw {
        message: `error while trying to getTransactionProductProperty. error: ${error.message}`
      }
    }
  },
  createTransactionProductProperty: async (
    newTransactionProductProperty: Record<string, any>
  ): Promise<ITransactionProductProperty> => {
    try {
      const transactionProductProperties = await db.insert(
        Tables.TRANSACTION_PRODUCT_PROPERTIES,
        newTransactionProductProperty
      )
      return transactionProductProperties?.[0]
    } catch (error) {
      console.error('ERROR in transactionProductPropertyModel.modal createTransactionProductProperty()', error.message)
      throw {
        message: `error while trying to createTransactionProductProperty. error: ${error.message}`
      }
    }
  },
  updateTransactionProductProperty: async (
    updatedTransactionProductProperty: Record<string, any>,
    condition: Record<string, any> | string
  ): Promise<ITransactionProductProperty | undefined> => {
    try {
      const transactionProductProperties = await db.update(
        Tables.TRANSACTION_PRODUCT_PROPERTIES,
        updatedTransactionProductProperty,
        condition
      )

      return transactionProductProperties?.[0]
    } catch (error) {
      console.error('ERROR in transactionProductPropertyModel.modal updateTransactionProductProperty()', error.message)
      throw {
        message: `error while trying to updateTransactionProductProperty. error: ${error.message}`
      }
    }
  }
}
