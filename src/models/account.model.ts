import { IAccount, ICompanyDetails } from 'safe-shore-common';
import DbService from '../services/db.service';

import _ from 'lodash';
import { Tables } from '../constants';
import { buildRange, getJsonBuildObject } from '../utils/db.utils';

const db = new DbService();

export const accountModel = {
  getAllAccounts: async (
    startDate?: string,
    endDate?: string
  ): Promise<IAccount[]> => {
    try {
      const accounts = await db.knex
        .select(
          `${Tables.ACCOUNTS}.*`,
          db.knex.raw(
            'COALESCE(summary.active_transaction_count, 0) AS active_transaction_count'
          ),
          db.knex.raw(`JSON_AGG(${Tables.USERS}) AS users`)
        )
        .from(Tables.ACCOUNTS)
        .leftJoin(
          Tables.USER_ACCOUNTS,
          `${Tables.ACCOUNTS}.id`,
          `${Tables.USER_ACCOUNTS}.account_id`
        )
        .leftJoin(
          db.knex
            .select(`${Tables.USER_ACCOUNTS}.account_id`)
            .count('transaction_id AS active_transaction_count')
            .from(Tables.USER_ACCOUNTS)
            .leftJoin(
              Tables.TRANSACTION_SIDES,
              `${Tables.USER_ACCOUNTS}.account_id`,
              `${Tables.TRANSACTION_SIDES}.user_account_id`
            )
            .leftJoin(
              Tables.TRANSACTIONS,
              `${Tables.TRANSACTIONS}.id`,
              `${Tables.TRANSACTION_SIDES}.transaction_id`
            )
            .whereIn(`${Tables.TRANSACTIONS}.status`, ['stage', 'dispute'])
            .groupBy(`${Tables.USER_ACCOUNTS}.account_id`)
            .as('summary'),
          'summary.account_id',
          `${Tables.ACCOUNTS}.id`
        )
        .leftJoin(
          Tables.USERS,
          `${Tables.USER_ACCOUNTS}.user_id`,
          `${Tables.USERS}.id`
        )
        .modify((queryBuilder) => {
          buildRange(
            queryBuilder,
            `${Tables.USERS}.last_active_at`,
            startDate,
            endDate
          );
        })
        .groupBy(`${Tables.ACCOUNTS}.id`, 'summary.active_transaction_count');

      return accounts;
    } catch (error) {
      console.error(
        'ERROR in UserAccounts.modal getAllAccounts()',
        error.message
      );
      throw {
        message: `error while trying to getAllAccounts. error: ${error.message}`,
      };
    }
  },
  getAccount: async (condition: Record<string, any>): Promise<IAccount[]> => {
    try {
      const account = await db.knex
        .select(
          `${Tables.ACCOUNTS}.*`,
          db.knex.raw(`JSON_AGG(${Tables.USERS}) as users`),
          db.knex.raw(
            `CASE WHEN ${
              Tables.COMPANY_DETAILS
            }.id IS NULL THEN null ELSE JSON_BUILD_OBJECT(${getJsonBuildObject(
              Tables.COMPANY_DETAILS,
              [Tables.COMPANY_DETAILS]
            )}) END as company_details`
          ),
          db.knex.raw(
            `CASE WHEN ${
              Tables.BANK_DETAILS
            }.id IS NULL THEN null ELSE JSON_BUILD_OBJECT(${getJsonBuildObject(
              Tables.BANK_DETAILS,
              [Tables.BANK_DETAILS]
            )}) END as bank_details`
          )
        )
        .from(Tables.ACCOUNTS)
        .leftJoin(
          Tables.USER_ACCOUNTS,
          `${Tables.ACCOUNTS}.id`,
          `${Tables.USER_ACCOUNTS}.account_id`
        )
        .leftJoin(
          Tables.USERS,
          `${Tables.USER_ACCOUNTS}.user_id`,
          `${Tables.USERS}.id`
        )
        .leftJoin(
          Tables.COMPANY_DETAILS,
          `${Tables.COMPANY_DETAILS}.account_id`,
          `${Tables.ACCOUNTS}.id`
        )
        .leftJoin(Tables.BANK_DETAILS, function () {
          this.on(
            `${Tables.BANK_DETAILS}.account_id`,
            `${Tables.ACCOUNTS}.id`
          ).andOn(`${Tables.BANK_DETAILS}.is_active`, db.knex.raw('true'));
        })

        .where(condition)
        .groupBy(
          `${Tables.ACCOUNTS}.id`,
          `${Tables.COMPANY_DETAILS}.id`,
          `${Tables.BANK_DETAILS}.id`
        );
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
      const account = await db.insert(Tables.ACCOUNTS, newAccount);
      return account?.[0];
    } catch (error) {
      console.error('ERROR in Accounts.modal createAccount()', error.message);
      throw {
        message: `error while trying to createAccount. error: ${error.message}`,
      };
    }
  },
  updateAccount: async (
    updatedAccount: Record<string, any>,
    condition: Record<string, any> | string
  ): Promise<IAccount[]> => {
    try {
      if (typeof condition === 'string') {
        condition = db.knex.raw(condition);
      }
      const account = await db.update(
        Tables.ACCOUNTS,
        updatedAccount,
        condition
      );
      return account;
    } catch (error) {
      console.error('ERROR in Accounts.modal updateAccount()', error.message);
      throw {
        message: `error while trying to updateAccount. error: ${error.message}`,
      };
    }
  },
  createCompanyDetails: async (
    updatedCompanyDetails: Record<string, any>
  ): Promise<ICompanyDetails[]> => {
    try {
      const companyDetails = await db.insert(
        Tables.COMPANY_DETAILS,
        updatedCompanyDetails
      );
      return companyDetails;
    } catch (error) {
      console.error(
        'ERROR in Accounts.modal updateCompanyDetails()',
        error.message
      );
      throw {
        message: `error while trying to updateCompanyDetails. error: ${error.message}`,
      };
    }
  },
};
