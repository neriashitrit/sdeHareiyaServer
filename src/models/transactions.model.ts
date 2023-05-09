import DbService from '../services/db.service';

import _ from 'lodash';
import { ITransaction, IUser } from 'safe-shore-common';
import { Tables } from '../constants';
import { getJsonBuildObject } from '../utils/db.utils';

const db = new DbService();

export const transactionModel = {
  getTransactions: async (
    condition: Record<string, any> | string
  ): Promise<ITransaction[]> => {
    const transaction = await db.knex
      .queryBuilder()
      .select([
        't.id',
        't.status',
        't.product_category_other',
        't.product_subcategory_other',
        't.amount_currency',
        't.amount',
        't.commission_payer',
        't.commission_amount_currency',
        't.commission_amount',
        't.end_date',
        't.cancel_reason',
        't.cancel_reason_other',
        't.deposit_bank_name',
        't.deposit_bank_number',
        't.deposit_bank_account_owner_full_name',
        't.deposit_transfer_date',
        't.deposit_reference_number',
        'drf.url as deposit_reference_file_url',
        't.created_at',
        't.updated_at',

        db.knex.raw(
          `JSON_BUILD_OBJECT(${getJsonBuildObject(Tables.PRODUCT_CATEGORIES, [
            'pc',
            'pcf',
          ])}) as product_category`
        ),
        db.knex.raw(
          `CASE WHEN psc.id IS NULL THEN null ELSE JSON_BUILD_OBJECT(${getJsonBuildObject(
            Tables.PRODUCT_SUBCATEGORIES,
            ['psc', 'pscf']
          )}) END as product_subcategory`
        ),
        db.knex.raw(
          `JSON_BUILD_OBJECT(${getJsonBuildObject(Tables.COMMISSIONS, [
            'c',
          ])})  as commission	`
        ),
      ])
      .from(`${Tables.TRANSACTIONS} as t`)
      .leftJoin(
        `${Tables.PRODUCT_CATEGORIES} as pc`,
        'pc.id',
        '=',
        't.product_category_id'
      )
      .leftJoin(`${Tables.FILES} as pcf`, function () {
        this.on('pc.id', '=', 'pcf.row_id').andOn(
          'pcf.table_name',
          '=',
          db.knex.raw('?', [Tables.PRODUCT_CATEGORIES])
        );
      })
      .leftJoin(
        `${Tables.PRODUCT_SUBCATEGORIES} as psc`,
        'psc.id',
        '=',
        't.product_subcategory_id'
      )
      .leftJoin(`${Tables.FILES} as pscf`, function () {
        this.on('psc.id', '=', 'pscf.row_id').andOn(
          'pscf.table_name',
          '=',
          db.knex.raw('?', [Tables.PRODUCT_SUBCATEGORIES])
        );
      })
      .leftJoin(`${Tables.COMMISSIONS} as c`, 't.commission_id', '=', 'c.id')
      .leftJoin(`${Tables.FILES} as drf`, function () {
        this.on('t.id', '=', 'drf.row_id').andOn(
          'drf.table_name',
          '=',
          db.knex.raw('?', [Tables.TRANSACTIONS])
        );
      })
      .leftJoin(
        `${Tables.TRANSACTION_SIDES} as ts`,
        'ts.transaction_id',
        '=',
        't.id'
      )
      .leftJoin(
        `${Tables.USER_ACCOUNTS} as ua`,
        'ua.id',
        '=',
        'ts.user_account_id'
      )
      .leftJoin(`${Tables.USERS} as u`, 'u.id', '=', 'ua.user_id')
      .where(condition)
      .groupBy(
        't.id',
        'c.id',
        'psc.id',
        'pc.id',
        'pcf.id',
        'pscf.id',
        'drf.id'
      );
    return transaction;
  },
  createTransaction: async (
    newTransaction: Record<string, any>
  ): Promise<ITransaction> => {
    try {
      const transaction = await db.insert(Tables.TRANSACTIONS, newTransaction);
      return transaction?.[0];
    } catch (error) {
      console.error(
        'ERROR in transactions.modal createTransaction()',
        error.message
      );
      throw {
        message: `error while trying to createTransaction. error: ${error.message}`,
      };
    }
  },
  updateTransaction: async (
    condition: Record<string, any> | string,
    updatedTransaction: Record<string, any>
  ): Promise<void> => {
    try {
      await db
        .knex(Tables.TRANSACTIONS)
        .where(condition)
        .update(updatedTransaction);
    } catch (error) {
      console.error(
        'ERROR in transactions.modal updateTransaction()',
        error.message
      );
      throw {
        message: `error while trying to updateTransaction. error: ${error.message}`,
      };
    }
  },
  getTransactionsAmountSumLastHalfYear: async (
    accountId: number
  ): Promise<number> => {
    try {
      const sum = await db
        .knex(Tables.TRANSACTIONS)
        .leftJoin(
          Tables.TRANSACTION_SIDES,
          `${Tables.TRANSACTIONS}.id`,
          '=',
          `${Tables.TRANSACTION_SIDES}.transaction_id`
        )
        .leftJoin(
          Tables.USER_ACCOUNTS,
          `${Tables.TRANSACTION_SIDES}.user_account_id`,
          '=',
          `${Tables.USER_ACCOUNTS}.id`
        )
        .leftJoin(
          Tables.ACCOUNTS,
          `${Tables.USER_ACCOUNTS}.account_id`,
          '=',
          `${Tables.ACCOUNTS}.id`
        )
        .select(
          db.knex.raw(`SUM(${Tables.TRANSACTIONS}.amount) as total_amount`)
        )
        .where(
          `${Tables.TRANSACTIONS}.created_at`,
          '>',
          db.knex.raw(`(NOW() - INTERVAL '6 months')`)
        )
        .andWhere(`${Tables.ACCOUNTS}.id`, '=', accountId);
      return sum[0].totalAmount as unknown as number;
    } catch (error) {
      console.error(
        'ERROR in transaction_stages.modal getTransactionsAmountSumLastHalfYear()',
        error.message
      );
      throw {
        message: `error while trying to getTransactionsAmountSumLastHalfYear. error: ${error.message}`,
      };
    }
  },
};
