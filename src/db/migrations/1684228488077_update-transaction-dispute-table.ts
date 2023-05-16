/* eslint-disable @typescript-eslint/naming-convention */
import { Tables } from '../../constants';
import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.renameColumn(Tables.TRANSACTION_DISPUTES, 'reasonOther', 'reason_other');
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.renameColumn(Tables.TRANSACTION_DISPUTES, 'reason_other', 'reasonOther');
}
