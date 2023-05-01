import { ITransactionSide } from 'safe-shore-common';
import DbService from '../services/db.service';

import _ from 'lodash';
import { Tables } from '../constants';

const db = new DbService();

export const transactionSideModel = {
  getTransactionSide: async (
    condition: Record<string, any> | string
  ): Promise<ITransactionSide> => {
    try {
      const result = await db.knex
        .select(
          'id',
          'side',
          'created_at',
          'updated_at',
          db.knex.raw('JSON_AGG(bd.*) as bank_details'),
          db.knex.raw('JSON_AGG(u.*) as user'),
          db.knex.raw('JSON_AGG(a.*) as account')
        )
        .from(`${Tables.TRANSACTION_SIDES}`)
        .leftJoin(`${Tables.BANK_DETAILS} as bd`, 'bank_details_id', 'bd.id')
        .leftJoin(`${Tables.USER_ACCOUNTS} as ua`, 'user_account_id', 'ua.id')
        .leftJoin(`${Tables.USERS} as u`, 'ua.user_id', 'u.id')
        .leftJoin(`${Tables.ACCOUNTS} as a`, 'ua.account_id', 'a.id')
        .where(condition)
        .groupBy('id', 'ua.id');
      const transactionSide: ITransactionSide = {
        id: result[0]?.id,
        user: result[0]?.user[0],
        account: result[0]?.account[0],
        bankDetails: result[0]?.bankDetails[0],
        side: result[0]?.side,
        createdAt: result[0]?.createdAt,
        updatedAt: result[0]?.updatedAt,
      };

      return transactionSide;
    } catch (error) {
      console.error(
        'ERROR in transactionSide.modal getTransactionSide()',
        error.message
      );
      throw {
        message: `error while trying to getTransactionSide. error: ${error.message}`,
      };
    }
  },
  createTransactionSide: async (
    newTransactionSide: Record<string, any>
  ): Promise<ITransactionSide> => {
    try {
      const transactionSide = await db.insert(Tables.TRANSACTION_SIDES, [
        newTransactionSide,
      ]);
      return transactionSide?.[0];
    } catch (error) {
      console.error(
        'ERROR in transactionSide.modal createTransactionSide()',
        error.message
      );
      throw {
        message: `error while trying to createTransactionSide. error: ${error.message}`,
      };
    }
  },
  updateTransactionSide: async (
    condition: Record<string, any>,
    updatedTransactionSide: Record<string, any>
  ): Promise<ITransactionSide> => {
    try {
      const transactionSide = await db.update(
        Tables.TRANSACTION_SIDES,
        updatedTransactionSide,
        condition
      );
      return transactionSide?.[0];
    } catch (error) {
      console.error(
        'ERROR in transactionSide.modal updateTransactionSideBy()',
        error.message
      );
      throw {
        message: `error while trying to updateTransactionSideBy. error: ${error.message}`,
      };
    }
  },
  updateTransactionSideById: async (
    id: number,
    updatedTransactionSide: Record<string, any>
  ): Promise<ITransactionSide> => {
    try {
      const transactionSide = await db.updateOneById(
        Tables.TRANSACTION_SIDES,
        updatedTransactionSide,
        id
      );
      return transactionSide?.[0];
    } catch (error) {
      console.error(
        'ERROR in transactionSide.modal updateTransactionSideById()',
        error.message
      );
      throw {
        message: `error while trying to updateTransactionSideById. error: ${error.message}`,
      };
    }
  },
};
