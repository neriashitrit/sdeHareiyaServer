/* eslint-disable @typescript-eslint/naming-convention */
import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate'

import { Tables } from '../../constants'

export const shorthands: ColumnDefinitions | undefined = undefined

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.alterColumn(Tables.FILES, 'azure_key', {
    notNull: false
  })
  pgm.alterColumn(Tables.FILES, 'table_name', {
    notNull: false
  })
  pgm.alterColumn(Tables.FILES, 'row_id', {
    notNull: false
  })
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.alterColumn(Tables.FILES, 'azure_key', {
    notNull: true
  })
  pgm.alterColumn(Tables.FILES, 'table_name', {
    notNull: true
  })
  pgm.alterColumn(Tables.FILES, 'row_id', {
    notNull: true
  })
}
