import DbService from '../services/db.service';

import _ from 'lodash';
import { Tables } from '../constants';
import { ITransactionProductProperty } from 'safe-shore-common';

const db = new DbService();

export const productPropertyModel = {
  getAllProductProperties: async (
    condition: Record<string, any> | string
  ): Promise<ITransactionProductProperty[]> => {
    try {
      const productProperties = await db.getAll(
        Tables.PRODUCT_PROPERTIES,
        condition
      );
      return productProperties;
    } catch (error) {
      console.error(
        'ERROR in productPropertyModel.modal getProductProperties()',
        error.message
      );
      throw {
        message: `error while trying to getProductProperties. error: ${error.message}`,
      };
    }
  },
  createProductProperty: async (
    newTransactionProductProperty: Record<string, any>
  ): Promise<ITransactionProductProperty> => {
    try {
      const transactionProductProperties = await db.insert(
        Tables.TRANSACTION_PRODUCT_PROPERTIES,
        newTransactionProductProperty
      );
      return transactionProductProperties?.[0];
    } catch (error) {
      console.error(
        'ERROR in productPropertyModel.modal createProductProperty()',
        error.message
      );
      throw {
        message: `error while trying to createProductProperty. error: ${error.message}`,
      };
    }
  },
};
