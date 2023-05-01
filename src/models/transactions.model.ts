import DbService from '../services/db.service';

import _ from 'lodash';
import { ITransaction, IUser } from 'safe-shore-common';
import { Tables } from '../constants';

const db = new DbService();

const transactionColumns = [
  'status',
  'product_category_other',
  'product_subcategory_other',
  'creator_side',
  'amount_currency',
  'amount',
  'commission_payer',
  'commission_amount_currency',
  'commission_amount',
  'end_date',
  'cancel_reason',
  'cancel_reason_other',
  'created_at',
  'updated_at',
  db.knex.raw(
    "JSON_AGG(JSON_BUILD_OBJECT('id', ts.id, 'side', ts.side , 'created_at', ts.created_at , 'updated_at', ts.updated_at, 'user_account', JSON_BUILD_OBJECT('id', ua.id, 'user', u.*, 'account', 'account', a.*), 'bank_details', bd.*)) as sides'"
  ),
  db.knex.raw(
    "JSON_AGG(JSON_BUILD_OBJECT('id', pc.id, 'name', pc.name , 'description', pc.description , 'created_at', pc.created_at , 'updated_at', pc.updated_at, 'icon_file', pcf.*)) as product_category'"
  ),
  db.knex.raw(
    "JSON_AGG(JSON_BUILD_OBJECT('id', psc.id, 'name', psc.name , 'description', psc.description , 'created_at', psc.created_at , 'updated_at', psc.updated_at, 'icon_file', pscf.*)) as product_subcategory'"
  ),
  db.knex.raw(
    "JSON_AGG(JSON_BUILD_OBJECT('id', c.id, 'is_active', c.is_active, 'from', c.from, 'to', c.to, 'type', c.type, 'amount', c.amount, 'created_at', c.created_at , 'updated_at', c.updated_at)) as product_subcategory'"
  ),
];

export const transactionModel = {
  getTransaction: async (
    condition: Record<string, any> | string
  ): Promise<ITransaction> => {
    const transaction = await db
      .knex(Tables.TRANSACTIONS)
      .select(transactionColumns)
      .leftJoin(
        `${Tables.PRODUCT_CATEGORIES} as pc`,
        `${Tables.PRODUCT_CATEGORIES}.id`,
        '=',
        'ts.product_category_id'
      )
      .leftJoin(`${Tables.FILES} as pcf`, function () {
        this.on(`${Tables.PRODUCT_CATEGORIES}.id`, '=', 'pcf.row_id').andOn(
          'pcf.table_name',
          '=',
          `${Tables.PRODUCT_CATEGORIES}`
        );
      })
      .leftJoin(
        `${Tables.PRODUCT_SUBCATEGORIES} as psc`,
        `${Tables.PRODUCT_SUBCATEGORIES}.id`,
        '=',
        'psc.product_subcategory_id'
      )
      .leftJoin(`${Tables.FILES} as pscf`, function () {
        this.on(`${Tables.PRODUCT_SUBCATEGORIES}.id`, '=', 'pscf.row_id').andOn(
          'pscf.table_name',
          '=',
          `${Tables.PRODUCT_SUBCATEGORIES}`
        );
      })
      .leftJoin(
        `${Tables.PRODUCT_PROPERTIES} as pp`,
        'pp.product_category_id',
        '=',
        'pc.id'
      )
      .leftJoin(
        `${Tables.TRANSACTION_SIDES} as ts`,
        `${Tables.TRANSACTIONS}.id`,
        '=',
        'ts.transaction_id'
      )
      .leftJoin(
        `${Tables.USER_ACCOUNTS} as ua`,
        'ts.user_account_id',
        '=',
        'ua.id'
      )
      .leftJoin(
        `${Tables.BANK_DETAILS} as bd`,
        'ts.bank_details_id',
        '=',
        'bd.id'
      )
      .leftJoin(
        `${Tables.COMMISSIONS} as c`,
        `${Tables.COMMISSIONS}.id`,
        '=',
        'commission_id'
      )
      .leftJoin(`${Tables.USERS} as u`, 'ua.user_id', '=', 'u.id')
      .leftJoin(`${Tables.ACCOUNTS} as a`, 'ua.account_id', '=', 'a.id')
      .where(condition)
      .first();
    return transaction;
  },
  createTransaction: async (
    newTransaction: Record<string, any>
  ): Promise<ITransaction> => {
    const transaction = await db.insert(Tables.TRANSACTIONS, [newTransaction]);
    return transaction?.[0];
  },
  updateTransaction: async (
    condition: Record<string, any> | string,
    updatedTransaction: Record<string, any>
  ): Promise<ITransaction> => {
    try {
      const transaction = await db
        .knex(Tables.TRANSACTIONS)
        .where(condition)
        .update(updatedTransaction)
        .returning(transactionColumns)
        .leftJoin(
          `${Tables.PRODUCT_CATEGORIES} as pc`,
          `${Tables.PRODUCT_CATEGORIES}.id`,
          '=',
          'ts.product_category_id'
        )
        .leftJoin(`${Tables.FILES} as pcf`, function () {
          this.on(`${Tables.PRODUCT_CATEGORIES}.id`, '=', 'pcf.row_id').andOn(
            'pcf.table_name',
            '=',
            `${Tables.PRODUCT_CATEGORIES}`
          );
        })
        .leftJoin(
          `${Tables.PRODUCT_SUBCATEGORIES} as psc`,
          `${Tables.PRODUCT_SUBCATEGORIES}.id`,
          '=',
          'psc.product_subcategory_id'
        )
        .leftJoin(`${Tables.FILES} as pscf`, function () {
          this.on(
            `${Tables.PRODUCT_SUBCATEGORIES}.id`,
            '=',
            'pscf.row_id'
          ).andOn('pscf.table_name', '=', `${Tables.PRODUCT_SUBCATEGORIES}`);
        })
        .leftJoin(
          `${Tables.PRODUCT_PROPERTIES} as pp`,
          'pp.product_category_id',
          '=',
          'pc.id'
        )
        .leftJoin(
          `${Tables.TRANSACTION_SIDES} as ts`,
          `${Tables.TRANSACTIONS}.id`,
          '=',
          'ts.transaction_id'
        )
        .leftJoin(
          `${Tables.USER_ACCOUNTS} as ua`,
          'ts.user_account_id',
          '=',
          'ua.id'
        )
        .leftJoin(
          `${Tables.BANK_DETAILS} as bd`,
          'ts.bank_details_id',
          '=',
          'bd.id'
        )
        .leftJoin(
          `${Tables.COMMISSIONS} as c`,
          `${Tables.COMMISSIONS}.id`,
          '=',
          'ts.commission_id'
        )
        .leftJoin(`${Tables.USERS} as u`, 'ua.user_id', '=', 'u.id')
        .leftJoin(`${Tables.ACCOUNTS} as a`, 'ua.account_id', '=', 'a.id');
      return transaction?.[0];
    } catch (error) {
      console.error(
        'ERROR in transactions.modal updateTransactionBy()',
        error.message
      );
      throw {
        message: `error while trying to updateTransactionBy. error: ${error.message}`,
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
