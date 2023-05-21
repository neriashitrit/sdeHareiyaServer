/* eslint-disable @typescript-eslint/naming-convention */
import { Tables } from '../../constants';
import { MigrationBuilder, ColumnDefinitions, PgType } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.alterColumn(Tables.BANK_DETAILS, 'branch_number', {
    type: PgType.VARCHAR,
  });
  pgm.alterColumn(Tables.BANK_DETAILS, 'bank_account_owner_id_number', {
    type: PgType.VARCHAR,
  });
  pgm.alterColumn(Tables.BANK_DETAILS, 'bank_account_number', {
    type: PgType.VARCHAR,
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.alterColumn(Tables.BANK_DETAILS, 'branch_number', {
    type: PgType.INT,
    using: 'branch_number::integer',
  });
  pgm.alterColumn(Tables.BANK_DETAILS, 'bank_account_owner_id_number', {
    type: PgType.INT,
    using: 'bank_account_owner_id_number::integer',
  });
  pgm.alterColumn(Tables.BANK_DETAILS, 'bank_account_number', {
    type: PgType.INT,
    using: 'bank_account_number::integer',
  });
}
