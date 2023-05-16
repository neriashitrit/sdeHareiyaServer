import { ITransactionStage } from 'safe-shore-common';
import DbService from '../services/db.service';

import _ from 'lodash';
import { Tables } from '../constants';
import { getJsonBuildObject } from '../utils/db.utils';

const db = new DbService();

export const transactionStageModel = {
  getTransactionStages: async (
    condition: Record<string, any> | string
  ): Promise<ITransactionStage[]> => {
    try {
      if (typeof condition === 'string') {
        condition = db.knex.raw(condition);
      }
      const transactionStage = await db.knex
        .queryBuilder()
        .select(
          'ts.id',
          'ts.name',
          'ts.in_charge',
          'ts.status',
          'ts.transaction_id',
          'ts.created_at',
          'ts.updated_at',
          db.knex.raw(
            `JSON_BUILD_OBJECT(${getJsonBuildObject(Tables.USERS, [
              'u',
            ])}) as user`
          )
        )
        .from(`${Tables.TRANSACTION_STAGES} as ts`)
        .leftJoin(`${Tables.USERS} as u`, 'ts.user_id', 'u.id')
        .where(condition)
        .groupBy('ts.id', 'u.id');
      return transactionStage;
    } catch (error) {
      console.error(
        'ERROR in transaction_stages.modal getTransactionStages()',
        error.message
      );
      throw {
        message: `error while trying to getTransactionStages. error: ${error.message}`,
      };
    }
  },
  createTransactionStage: async (
    newTransactionStage: Record<string, any>
  ): Promise<ITransactionStage> => {
    try {
      const transactionStage = await db.insert(
        Tables.TRANSACTION_STAGES,
        newTransactionStage
      );
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
        'ERROR in transaction_stages.modal updateTransactionStage()',
        error.message
      );
      throw {
        message: `error while trying to updateTransactionStage. error: ${error.message}`,
      };
    }
  },
};
