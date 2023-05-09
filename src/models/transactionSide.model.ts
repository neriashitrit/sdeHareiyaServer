import { ITransactionSide } from 'safe-shore-common';
import DbService from '../services/db.service';

import _ from 'lodash';
import { Tables } from '../constants';
import { getJsonBuildObject } from '../utils/db.utils';

const db = new DbService();

export const transactionSideModel = {
  getTransactionSides: async (
    condition: Record<string, any> | string
  ): Promise<ITransactionSide[]> => {
    try {
      if (typeof condition === 'string') {
        condition = db.knex.raw(condition);
      }
      const result = await db.knex
        .queryBuilder()
        .select(
          'ts.id',
          'ts.side',
          'ts.transaction_id',
          'ts.created_at',
          'ts.updated_at',
          'ts.is_creator',
          db.knex.raw(
            `CASE WHEN bd.id IS NULL THEN null ELSE JSON_BUILD_OBJECT(${getJsonBuildObject(
              Tables.BANK_DETAILS,
              ['bd', 'a']
            )}) END as bank_details`
          ),
          db.knex.raw(
            `JSON_BUILD_OBJECT(${getJsonBuildObject(Tables.USERS, [
              'u',
            ])}) as user`
          ),
          db.knex.raw(
            `JSON_BUILD_OBJECT(${getJsonBuildObject(Tables.ACCOUNTS, [
              'a',
            ])}) as account`
          )
        )
        .from(`${Tables.TRANSACTION_SIDES} as ts`)
        .leftJoin(`${Tables.BANK_DETAILS} as bd`, 'ts.bank_details_id', 'bd.id')
        .leftJoin(
          `${Tables.USER_ACCOUNTS} as ua`,
          'ts.user_account_id',
          'ua.id'
        )
        .leftJoin(`${Tables.USERS} as u`, 'ua.user_id', 'u.id')
        .leftJoin(`${Tables.ACCOUNTS} as a`, 'ua.account_id', 'a.id')
        .where(condition)
        .groupBy('ts.id', 'ua.id', 'bd.id', 'u.id', 'a.id');

      return result;
    } catch (error) {
      console.error(
        'ERROR in transactionSide.modal getTransactionSides()',
        error.message
      );
      throw {
        message: `error while trying to getTransactionSides. error: ${error.message}`,
      };
    }
  },
  createTransactionSide: async (
    newTransactionSide: Record<string, any>
  ): Promise<ITransactionSide> => {
    try {
      const transactionSide = await db.insert(
        Tables.TRANSACTION_SIDES,
        newTransactionSide
      );
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
  ): Promise<ITransactionSide | undefined> => {
    try {
      const transactionSide = await db.update(
        Tables.TRANSACTION_SIDES,
        updatedTransactionSide,
        condition
      );
      return transactionSide?.[0];
    } catch (error) {
      console.error(
        'ERROR in transactionSide.modal updateTransactionSide()',
        error.message
      );
      throw {
        message: `error while trying to updateTransactionSide. error: ${error.message}`,
      };
    }
  },
};
