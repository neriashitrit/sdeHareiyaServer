/* eslint-disable @typescript-eslint/naming-convention */
import { Tables } from '../../constants';
import { MigrationBuilder, ColumnDefinitions, PgType } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.alterColumn(Tables.COMMISSIONS, 'to', {
    notNull: false,
  });
  pgm.alterColumn(Tables.COMMISSIONS, 'amount', {
    type: PgType.REAL,
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {}
