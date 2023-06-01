/* eslint-disable @typescript-eslint/naming-convention */
import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate'

import { Tables } from '../../constants'

export const shorthands: ColumnDefinitions | undefined = undefined

export async function up(pgm: MigrationBuilder): Promise<void> {
  Object.values(Tables).map((tableName) =>
    pgm.createTrigger(tableName, 'on_update', {
      when: 'BEFORE',
      operation: 'UPDATE',
      level: 'ROW',
      function: 'update_timestamp'
    })
  )
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  Object.values(Tables).map((tableName) => pgm.dropTrigger(tableName, 'on_update'))
}
