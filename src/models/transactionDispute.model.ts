import { ITransactionDispute } from 'safe-shore-common';
import DbService from '../services/db.service';

import _ from 'lodash';
import { Tables } from '../constants';

const db = new DbService();

export const transactionDisputeModel = {
  getTransactionDisputes: async (
    condition: Record<string, any> | string
  ): Promise<ITransactionDispute[]> => {
    try {
      if (typeof condition === 'string') {
        condition = db.knex.raw(condition);
      }
      const transactionDisputes = await db.getAll(
        Tables.TRANSACTION_DISPUTES,
        condition
      );
      return transactionDisputes;
    } catch (error) {
      console.error(
        'ERROR in transactionDispute.modal getTransactionDisputes()',
        error.message
      );
      throw {
        message: `error while trying to getTransactionDisputes. error: ${error.message}`,
      };
    }
  },
  createTransactionDispute: async (
    newTransactionDispute: Record<string, any>
  ): Promise<ITransactionDispute> => {
    try {
      const transactionDispute = await db.insert(
        Tables.TRANSACTION_DISPUTES,
        newTransactionDispute
      );
      return transactionDispute?.[0];
    } catch (error) {
      console.error(
        'ERROR in transactionDispute.modal createTransactionDispute()',
        error.message
      );
      throw {
        message: `error while trying to createTransactionDispute. error: ${error.message}`,
      };
    }
  },
  updateTransactionDispute: async (
    condition: Record<string, any>,
    updatedTransactionDispute: Record<string, any>
  ): Promise<ITransactionDispute | undefined> => {
    try {
      const transactionDispute = await db.update(
        Tables.TRANSACTION_DISPUTES,
        updatedTransactionDispute,
        condition
      );
      return transactionDispute?.[0];
    } catch (error) {
      console.error(
        'ERROR in transactionDispute.modal updateTransactionDispute()',
        error.message
      );
      throw {
        message: `error while trying to updateTransactionDispute. error: ${error.message}`,
      };
    }
  },
};
