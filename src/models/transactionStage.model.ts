import { ITransactionStage } from 'safe-shore-common';
import DbService from '../services/db.service';

import _ from 'lodash';
import { Tables } from '../constants';

const db = new DbService();

export const transactionStageModel = {
  getTransactionStageById: async (
    id: number
  ): Promise<ITransactionStage | undefined> => {
    try {
      const transactionStage = await db.getOneById(
        Tables.TRANSACTION_STAGES,
        id
      );
      return transactionStage;
    } catch (error) {
      console.error(
        'ERROR in transaction_stages.modal getTransactionStageById()',
        error.message
      );
      throw {
        message: `error while trying to getTransactionStageById. error: ${error.message}`,
      };
    }
  },
  getTransactionStage: async (
    condition: Record<string, any> | string
  ): Promise<ITransactionStage | undefined> => {
    try {
      const transactionStage = await db.getOne(
        Tables.TRANSACTION_STAGES,
        condition
      );
      return transactionStage ?? null;
    } catch (error) {
      console.error(
        'ERROR in transaction_stages.modal getTransactionStageBy()',
        error.message
      );
      throw {
        message: `error while trying to getTransactionStageBy. error: ${error.message}`,
      };
    }
  },
  createTransactionStage: async (
    newTransactionStage: Record<string, any>
  ): Promise<ITransactionStage | undefined> => {
    try {
      const transactionStage = await db.insert(Tables.TRANSACTION_STAGES, [
        newTransactionStage,
      ]);
      return transactionStage?.[0];
    } catch (error) {
      console.error(
        'ERROR in transaction_stages.modal createTransactionStage()',
        error.message
      );
      throw {
        message: `error while trying to createTransactionStage. error: ${error.message}`,
      };
    }
  },
  updateTransactionStage: async (
    condition: Record<string, any>,
    updatedTransactionStage: Record<string, any>
  ): Promise<ITransactionStage | undefined> => {
    try {
      const transactionStage = await db.update(
        Tables.TRANSACTION_STAGES,
        updatedTransactionStage,
        condition
      );
      return transactionStage?.[0];
    } catch (error) {
      console.error(
        'ERROR in transaction_stages.modal updateTransactionStageBy()',
        error.message
      );
      throw {
        message: `error while trying to updateTransactionStage. error: ${error.message}`,
      };
    }
  },
  updateTransactionStageById: async (
    id: number,
    updatedTransactionStage: Record<string, string | number | boolean>
  ): Promise<ITransactionStage | undefined> => {
    try {
      const transactionStage = await db.updateOneById(
        Tables.TRANSACTION_STAGES,
        updatedTransactionStage,
        id
      );
      return transactionStage?.[0];
    } catch (error) {
      console.error(
        'ERROR in transaction_stages.modal updateTransactionStageById()',
        error.message
      );
      throw {
        message: `error while trying to updateTransactionStageById. error: ${error.message}`,
      };
    }
  },
};
