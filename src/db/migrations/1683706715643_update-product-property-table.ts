/* eslint-disable @typescript-eslint/naming-convention */
import { Tables } from '../../constants';
import { MigrationBuilder, ColumnDefinitions, PgType } from 'node-pg-migrate';
import { alterColumn } from 'node-pg-migrate/dist/operations/tables';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.alterColumn(Tables.PRODUCT_PROPERTIES, 'select_options', {
    type: 'text[]',
    using: 'select_options::text[]',
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.alterColumn(Tables.PRODUCT_PROPERTIES, 'select_options', {
    type: PgType.VARCHAR,
  });
}
