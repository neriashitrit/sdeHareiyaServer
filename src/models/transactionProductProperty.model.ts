import { IUser } from 'safe-shore-common';
import DbService from '../services/db.service';

import _ from 'lodash';
import { Tables } from '../constants';
import { ITransactionProductProperty } from 'safe-shore-common/dist/models';

const db = new DbService();

export const transactionProductPropertyModel = {
  getTransactionProductProperty: async (
    condition: Record<string, any> | string
  ): Promise<ITransactionProductProperty> => {
    try {
      const transactionProductProperties = await db.getOne(
        Tables.TRANSACTION_PRODUCT_PROPERTIES,
        condition
      );
      return transactionProductProperties?.[0];
    } catch (error) {
      console.error(
        'ERROR in transactionProductPropertyModel.modal createTransactionProductProperty()',
        error.message
      );
      throw {
        message: `error while trying to createTransactionProductProperty. error: ${error.message}`,
      };
    }
  },
  createTransactionProductProperty: async (
    newTransactionProductProperty: Record<string, any>
  ): Promise<ITransactionProductProperty> => {
    try {
      const transactionProductProperties = await db.insert(
        Tables.TRANSACTION_PRODUCT_PROPERTIES,
        [newTransactionProductProperty]
      );
      return transactionProductProperties?.[0];
    } catch (error) {
      console.error(
        'ERROR in transactionProductPropertyModel.modal createTransactionProductProperty()',
        error.message
      );
      throw {
        message: `error while trying to createTransactionProductProperty. error: ${error.message}`,
      };
    }
  },
  updateTransactionProductProperty: async (
    updatedTransactionProductProperty: Record<string, any>,
    condition: Record<string, any> | string
  ): Promise<ITransactionProductProperty> => {
    try {
      const transactionProductProperties = await db.update(
        Tables.TRANSACTION_PRODUCT_PROPERTIES,
        updatedTransactionProductProperty,
        condition
      );
      return transactionProductProperties?.[0];
    } catch (error) {
      console.error(
        'ERROR in transactionProductPropertyModel.modal updateTransactionProductProperty()',
        error.message
      );
      throw {
        message: `error while trying to updateTransactionProductProperty. error: ${error.message}`,
      };
    }
  },
};
