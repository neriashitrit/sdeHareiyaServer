/* eslint-disable @typescript-eslint/naming-convention */
import { Tables } from '../../constants';
import { MigrationBuilder, ColumnDefinitions, PgType } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable(Tables.TRANSACTION_PRODUCT_PROPERTIES, {
    id: 'id',
    transaction_id: {
      type: PgType.INT,
      references: Tables.TRANSACTIONS,
      onDelete: 'SET NULL',
    },
    product_property_id: {
      type: PgType.INT,
      references: Tables.PRODUCT_PROPERTIES,
      onDelete: 'SET NULL',
    },
    value: { type: PgType.VARCHAR, notNull: true },
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
