/* eslint-disable @typescript-eslint/naming-convention */
import { TransactionSide } from '../../types/enums';
import { Tables } from '../../constants';
import { MigrationBuilder, ColumnDefinitions, PgType } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createType('transaction_side', Object.values(TransactionSide));

  pgm.createTable(Tables.TRANSACTION_SIDES, {
    id: 'id',
    account_id: {
      type: PgType.INT,
      references: Tables.ACCOUNTS,
      onDelete: 'SET NULL',
      notNull: false,
    },
    bank_details_id: {
      type: PgType.INT,
      references: Tables.BANK_DETAILS,
      onDelete: 'SET NULL',
      notNull: false,
    },
    transaction_id: {
      type: PgType.INT,
      references: Tables.TRANSACTIONS,
      onDelete: 'SET NULL',
      notNull: false,
      unique: true,
    },
    side: { type: 'transaction_side', notNull: true },
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
  pgm.dropType('transaction_side', { ifExists: true });
}
