/* eslint-disable @typescript-eslint/naming-convention */
import { Tables } from '../../constants';
import { MigrationBuilder, ColumnDefinitions, PgType } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable(Tables.FILES, {
    id: 'id',
    url: { type: PgType.VARCHAR, notNull: true },
    table_name: { type: PgType.VARCHAR },
    row_id: { type: PgType.INT },
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
  pgm.dropTable(Tables.FILES, { ifExists: true });
}
