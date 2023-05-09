import DbService from '../services/db.service';

import _ from 'lodash';
import { Tables } from '../constants';
import { IUserAccount } from 'safe-shore-common';
import { getJsonBuildObject } from '../utils/db.utils';

const db = new DbService();

export const userAccountModel = {
  getUserAccount: async (
    condition: Record<string, any>
  ): Promise<IUserAccount | undefined> => {
    try {
      const userAccount = await db.knex
        .queryBuilder()
        .select(
          'ua.id',
          'ua.created_at',
          'ua.updated_at',
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
        .from(`${Tables.USER_ACCOUNTS} as ua`)
        .where(condition)
        .leftJoin(`${Tables.ACCOUNTS} as a`, `ua.account_id`, 'a.id')
        .leftJoin(`${Tables.USERS} as u`, `ua.user_id`, 'u.id')
        .groupBy('ua.id', 'u.id', 'a.id')
        .first();
      return userAccount;
    } catch (error) {
      console.error(
        'ERROR in UserAccounts.modal getUserAccount()',
        error.message
      );
      throw {
        message: `error while trying to getUserAccount. error: ${error.message}`,
      };
    }
  },
  createUserAccount: async (
    newUserAccount: Record<string, string | number | boolean>
  ): Promise<IUserAccount> => {
    try {
      const userAccount = await db.insert(Tables.USER_ACCOUNTS, newUserAccount);
      return userAccount?.[0];
    } catch (error) {
      console.error(
        'ERROR in UserAccounts.modal createUserAccount()',
        error.message
      );
      throw {
        message: `error while trying to createUserAccount. error: ${error.message}`,
      };
    }
  },
};
