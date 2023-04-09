/* eslint-disable @typescript-eslint/naming-convention */
import { CommissionPayer, TransactionStatus } from '../../types/transaction';
import { Tables } from '../../constants';
import { MigrationBuilder, ColumnDefinitions, PgType } from 'node-pg-migrate';
import { Currency } from '../../types/enums';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createType('transaction_status', Object.values(TransactionStatus));
  pgm.createType('currency', Object.values(Currency));
  pgm.createType('commission_payer', Object.values(CommissionPayer));

  pgm.func(`setval('transactions_id_seq', 999)`);

  pgm.createTable(Tables.TRANSACTIONS, {
    id: 'id',
    status: { type: 'transaction_status', notNull: true },
    amount_currency: { type: 'currency', notNull: true },
    amount: { type: PgType.INT, notNull: true },
    comission_id: {
      type: PgType.INT,
      references: Tables.COMMISSIONS,
      onDelete: 'SET NULL',
      notNull: false,
    },
    commission_payer: { type: 'commission_payer', notNull: true },
    comission_amount_currency: { type: 'currency', notNull: true },
    comission_amount: { type: PgType.INT, notNull: true },
    endDate: {
      type: PgType.TIMESTAMP_WITHOUT_TIME_ZONE,
      notNull: true,
    },
    cancel_reason: { type: PgType.VARCHAR },
    cancel_reason_other: { type: PgType.VARCHAR },
    product_category_id: {
      type: PgType.INT,
      references: Tables.PRODUCT_CATEGORIES,
      onDelete: 'SET NULL',
      notNull: false,
    },
    created_at: {
      type: PgType.TIMESTAMP_WITHOUT_TIME_ZONE,
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: PgType.TIMESTAMP_WITHOUT_TIME_ZONE,
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable(Tables.TRANSACTIONS, { ifExists: true });
  pgm.dropType('transaction_status', { ifExists: true });
  pgm.dropType('currency', { ifExists: true });
  pgm.dropType('commission_payer', { ifExists: true });
}
