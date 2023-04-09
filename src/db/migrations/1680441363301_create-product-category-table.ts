/* eslint-disable @typescript-eslint/naming-convention */
import { Tables } from '../../constants';
import { MigrationBuilder, ColumnDefinitions, PgType } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable(Tables.PRODUCT_CATEGORIES, {
    id: 'id',
    name: { type: PgType.VARCHAR, notNull: true },
    title: { type: PgType.VARCHAR, notNull: true },
    icon_file_id: {
      type: PgType.INT,
      references: Tables.FILES,
      onDelete: 'SET NULL',
      notNull: false,
    },
    description: { type: PgType.VARCHAR, notNull: true },
    updated_at: {
      type: PgType.TIMESTAMP_WITHOUT_TIME_ZONE,
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    created_at: {
      type: PgType.TIMESTAMP_WITHOUT_TIME_ZONE,
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable(Tables.PRODUCT_CATEGORIES, { ifExists: true });
}
