import { IAccount } from 'safe-shore-common';
import DbService from '../services/db.service';

import _ from 'lodash';
import { Tables } from '../constants';

const db = new DbService();

export const accountModel = {
  getAccount: async (condition: Record<string, any>): Promise<IAccount> => {
    try {
      const account = await db.getOne(Tables.ACCOUNTS, condition);
      return account?.[0];
    } catch (error) {
      console.error('ERROR in Accounts.modal getAccount()', error.message);
      throw {
        message: `error while trying to getAccount. error: ${error.message}`,
      };
    }
  },
  createAccount: async (
    newAccount: Record<string, string | number | boolean>
  ): Promise<IAccount> => {
    try {
      const transactionSide = await db.insert(Tables.ACCOUNTS, [newAccount]);
      return transactionSide?.[0];
    } catch (error) {
      console.error('ERROR in Accounts.modal createAccount()', error.message);
      throw {
        message: `error while trying to createAccount. error: ${error.message}`,
      };
    }
  },
};
