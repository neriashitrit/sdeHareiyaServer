import _ from 'lodash'
import { IProductProperty } from 'safe-shore-common'

import { Tables } from '../constants'
import DbService from '../services/db.service'

const db = new DbService()

export const productPropertyModel = {
  getAllProductProperties: async (condition: Record<string, any> | string): Promise<IProductProperty[]> => {
    try {
      const productProperties = await db.getAll(Tables.PRODUCT_PROPERTIES, condition)
      return productProperties
    } catch (error) {
      console.error('ERROR in productPropertyModel.modal getProductProperties()', error.message)
      throw {
        message: `error while trying to getProductProperties. error: ${error.message}`
      }
    }
  },
  createProductProperties: async (
    newTransactionProductProperties: Record<string, any>[]
  ): Promise<IProductProperty[]> => {
    try {
      const productProperties = await db.insert(Tables.PRODUCT_PROPERTIES, newTransactionProductProperties)
      return productProperties
    } catch (error) {
      console.error('ERROR in productPropertyModel.modal createProductProperties()', error.message)
      throw {
        message: `error while trying to createProductProperties. error: ${error.message}`
      }
    }
  }
}
