/* eslint-disable @typescript-eslint/naming-convention */
import { PropertyType } from 'safe-shore-common';
import { Tables } from '../../constants';
import { MigrationBuilder, ColumnDefinitions, PgType } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createType('product_property_type', Object.values(PropertyType));

  pgm.createTable(Tables.PRODUCT_PROPERTIES, {
    id: 'id',
    product_category_id: {
      type: PgType.INT,
      references: Tables.PRODUCT_CATEGORIES,
      onDelete: 'SET NULL',
    },
    name: { type: PgType.VARCHAR, notNull: true },
    type: { type: 'product_property_type', notNull: true },
    label: { type: PgType.VARCHAR, notNull: true },
    validation: { type: PgType.VARCHAR },
    multiple_files: { type: PgType.BOOLEAN },
    line_count_text: { type: PgType.INT },
    select_options: { type: PgType.VARCHAR },
    helperText: { type: PgType.VARCHAR },
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
  pgm.dropTable(Tables.PRODUCT_PROPERTIES, { ifExists: true });
  pgm.dropType('product_property_type', { ifExists: true });
}
