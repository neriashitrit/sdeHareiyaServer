/* eslint-disable @typescript-eslint/naming-convention */
import { Tables } from '../../constants';
import { MigrationBuilder, ColumnDefinitions, PgType } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.addColumn(Tables.TRANSACTION_SIDES, {
    is_creator: { type: PgType.BOOLEAN },
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropColumn(Tables.TRANSACTION_SIDES, 'is_creator');
}
