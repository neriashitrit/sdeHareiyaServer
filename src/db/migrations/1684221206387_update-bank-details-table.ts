/* eslint-disable @typescript-eslint/naming-convention */
import { Tables } from '../../constants';
import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.renameColumn(Tables.BANK_DETAILS, 'account', 'account_id');
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.renameColumn(Tables.BANK_DETAILS, 'account_id', 'account');
}
