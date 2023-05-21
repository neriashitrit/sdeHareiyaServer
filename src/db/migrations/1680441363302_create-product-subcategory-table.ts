/* eslint-disable @typescript-eslint/naming-convention */
import { ColumnDefinitions, MigrationBuilder, PgType } from 'node-pg-migrate'

import { Tables } from '../../constants'

export const shorthands: ColumnDefinitions | undefined = undefined

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable(Tables.PRODUCT_SUBCATEGORIES, {
    id: 'id',
    product_category_id: {
      type: PgType.INT,
      references: Tables.PRODUCT_CATEGORIES,
      onDelete: 'SET NULL'
    },
    name: { type: PgType.VARCHAR, notNull: true },
    description: { type: PgType.VARCHAR, notNull: true },
    updated_at: {
      type: PgType.TIMESTAMP_WITHOUT_TIME_ZONE,
      notNull: true,
      default: pgm.func('current_timestamp')
    },
    created_at: {
      type: PgType.TIMESTAMP_WITHOUT_TIME_ZONE,
      notNull: true,
      default: pgm.func('current_timestamp')
    }
  })
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable(Tables.PRODUCT_SUBCATEGORIES, { ifExists: true })
}
