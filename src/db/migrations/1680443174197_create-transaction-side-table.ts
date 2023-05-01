/* eslint-disable @typescript-eslint/naming-convention */
import { TransactionSide } from 'safe-shore-common';
import { Tables } from '../../constants';
import { MigrationBuilder, ColumnDefinitions, PgType } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable(Tables.TRANSACTION_SIDES, {
    id: 'id',
    user_account_id: {
      type: PgType.INT,
      references: Tables.USER_ACCOUNTS,
      onDelete: 'SET NULL',
      notNull: true,
    },
    bank_details_id: {
      type: PgType.INT,
      references: Tables.BANK_DETAILS,
      onDelete: 'SET NULL',
    },
    transaction_id: {
      type: PgType.INT,
      references: Tables.TRANSACTIONS,
      onDelete: 'SET NULL',
      notNull: true,
    },
    side: { type: 'transaction_side' },
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
  pgm.dropTable(Tables.TRANSACTION_SIDES, { ifExists: true, cascade: true });
}
