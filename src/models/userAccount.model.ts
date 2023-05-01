import DbService from '../services/db.service';

import _ from 'lodash';
import { Tables } from '../constants';
import { IUserAccount } from 'safe-shore-common';

const db = new DbService();

export const userAccountModel = {
  getUserAccount: async (
    condition: Record<string, any>
  ): Promise<IUserAccount> => {
    try {
      const account = await db
        .getOne(Tables.USER_ACCOUNTS, condition)
        .leftJoin(`${Tables.ACCOUNTS} as a`, 'user_accounts.account_id', 'a.id')
        .leftJoin(`${Tables.USERS} as u`, 'user_accounts.account_id', 'u.id');
      return account;
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
      const account = await db.insert(Tables.USER_ACCOUNTS, [newUserAccount]);
      return account?.[0];
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
