/* eslint-disable @typescript-eslint/naming-convention */
import { ColumnDefinitions, MigrationBuilder, PgType } from 'node-pg-migrate'

import { Tables } from '../../constants'

export const shorthands: ColumnDefinitions | undefined = undefined

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.addColumn(Tables.PRODUCT_PROPERTIES, {
    order: { type: PgType.INT, notNull: true, default: 0 }
  })
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropColumn(Tables.PRODUCT_PROPERTIES, 'order')
}
