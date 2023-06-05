/* eslint-disable @typescript-eslint/naming-convention */
import { ColumnDefinitions, MigrationBuilder, PgType } from 'node-pg-migrate'
import { CommissionPayer, Currency, TransactionSide, TransactionStatus } from 'safe-shore-common'

import { Tables } from '../../constants'

export const shorthands: ColumnDefinitions | undefined = undefined

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createType('transaction_status', Object.values(TransactionStatus))
  pgm.createType('currency', Object.values(Currency))
  pgm.createType('commission_payer', Object.values(CommissionPayer))
  pgm.createType('transaction_side', Object.values(TransactionSide))

  pgm.createTable(Tables.TRANSACTIONS, {
    id: 'id',
    status: { type: 'transaction_status', notNull: true },
    product_category_id: {
      type: PgType.INT,
      references: Tables.PRODUCT_CATEGORIES,
      onDelete: 'SET NULL'
    },
    product_category_other: { type: PgType.VARCHAR },
    product_subcategory_id: {
      type: PgType.INT,
      references: Tables.PRODUCT_SUBCATEGORIES,
      onDelete: 'SET NULL'
    },
    product_subcategory_other: { type: PgType.VARCHAR },
    creator_side: { type: 'transaction_side' },
    amount_currency: { type: 'currency', notNull: true },
    amount: { type: PgType.INT, notNull: true },
    commission_id: {
      type: PgType.INT,
      references: Tables.COMMISSIONS,
      onDelete: 'SET NULL'
    },
    commission_payer: { type: 'commission_payer' },
    commission_amount_currency: { type: 'currency', notNull: true },
    commission_amount: { type: PgType.INT, notNull: true },
    end_date: {
      type: PgType.TIMESTAMP_WITHOUT_TIME_ZONE
    },
    cancel_reason: { type: PgType.VARCHAR },
    cancel_reason_other: { type: PgType.VARCHAR },
    created_at: {
      type: PgType.TIMESTAMP_WITHOUT_TIME_ZONE,
      notNull: true,
      default: pgm.func('current_timestamp')
    },
    updated_at: {
      type: PgType.TIMESTAMP_WITHOUT_TIME_ZONE,
      notNull: true,
      default: pgm.func('current_timestamp')
    }
  })
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable(Tables.TRANSACTIONS, { ifExists: true })
  pgm.dropType('transaction_status', { ifExists: true })
  pgm.dropType('currency', { ifExists: true })
  pgm.dropType('commission_payer', { ifExists: true })
  pgm.dropType('transaction_side', { ifExists: true })
}
