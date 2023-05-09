/* eslint-disable @typescript-eslint/naming-convention */
import { Tables } from '../../constants';
import { MigrationBuilder, ColumnDefinitions, PgType } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.alterColumn(Tables.TRANSACTIONS, 'amount', {
    type: PgType.REAL,
  });
  pgm.alterColumn(Tables.TRANSACTIONS, 'commission_amount', {
    type: PgType.REAL,
  });
  pgm.dropColumn(Tables.TRANSACTIONS, 'creator_side');
  pgm.addColumns(Tables.TRANSACTIONS, {
    deposit_bank_name: { type: PgType.VARCHAR },
    deposit_bank_number: { type: PgType.VARCHAR },
    deposit_bank_account_owner_full_name: { type: PgType.VARCHAR },
    deposit_transfer_date: { type: PgType.VARCHAR },
    deposit_reference_number: { type: PgType.VARCHAR },
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.addColumn(Tables.TRANSACTIONS, {
    creator_side: { type: 'transaction_side' },
  });
  pgm.dropColumns(Tables.TRANSACTIONS, [
    'deposit_bank_name',
    'deposit_bank_number',
    'deposit_bank_account_owner_full_name',
    'deposit_transfer_date',
    'deposit_reference_number',
    'delivery_date',
    'delivery_type',
    'delivery_notes',
  ]);
}
