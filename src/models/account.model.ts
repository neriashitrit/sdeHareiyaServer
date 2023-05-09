import { IAccount } from 'safe-shore-common';
import DbService from '../services/db.service';

import _ from 'lodash';
import { Tables } from '../constants';

const db = new DbService();

export const accountModel = {
  getAllAccounts: async (
    startDate?: string,
    endDate?: string
  ): Promise<IAccount[]> => {
    try {
      const accounts = await db.knex
        .select(
          'accounts.*',
          db.knex.raw(
            'coalesce(summary.active_transaction_count, 0) as active_transaction_count'
          ),
          db.knex.raw('json_agg(users) as users')
        )
        .from('accounts')
        .leftJoin('user_accounts', 'accounts.id', 'user_accounts.account_id')
        .leftJoin(
          db.knex
            .select('user_accounts.account_id')
            .count('transaction_id as active_transaction_count')
            .from('user_accounts')
            .leftJoin(
              'transaction_sides',
              'user_accounts.account_id',
              'transaction_sides.user_account_id'
            )
            .leftJoin(
              'transactions',
              'transactions.id',
              'transaction_sides.transaction_id'
            )
            .whereIn('transactions.status', ['stage', 'dispute'])
            .groupBy('user_accounts.account_id')
            .as('summary'),
          'summary.account_id',
          'accounts.id'
        )
        .leftJoin('users', 'user_accounts.user_id', 'users.id')
        .modify((queryBuilder) => {
          if (startDate && endDate) {
            // If both start and end dates are specified, filter by the date range
            queryBuilder.whereBetween('users.last_active_at', [
              `${startDate} 00:00:00`,
              `${endDate} 23:59:59`,
            ]);
          } else if (startDate) {
            // If only the start date is specified, filter by that date and later
            queryBuilder.where(
              'users.last_active_at',
              '>=',
              `${startDate} 00:00:00`
            );
          } else if (endDate) {
            // If only the end date is specified, filter by that date and earlier
            queryBuilder.where(
              'users.last_active_at',
              '<=',
              `${endDate} 23:59:59`
            );
          }
        })
        .groupBy('accounts.id', 'summary.active_transaction_count');
      return accounts;
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
  getAccount: async (condition: Record<string, any>): Promise<IAccount> => {
    try {
      const account: IAccount = await db.knex
        .select('accounts.*', db.knex.raw('json_agg(users) as users'))
        .from('accounts')
        .leftJoin('user_accounts', 'accounts.id', 'user_accounts.account_id')
        .leftJoin('users', 'user_accounts.user_id', 'users.id')
        .where(condition)
        .groupBy('accounts.id');
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
  createAccount: async (
    newAccount: Record<string, string | number | boolean>
  ): Promise<IAccount> => {
    try {
      const transactionSide = await db.insert(Tables.ACCOUNTS, newAccount);
      return transactionSide?.[0];
    } catch (error) {
      console.error('ERROR in Accounts.modal createAccount()', error.message);
      throw {
        message: `error while trying to createAccount. error: ${error.message}`,
      };
    }
  },
};
