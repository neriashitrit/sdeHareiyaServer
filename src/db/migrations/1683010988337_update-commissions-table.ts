/* eslint-disable @typescript-eslint/naming-convention */
import { ColumnDefinitions, MigrationBuilder, PgType } from 'node-pg-migrate'

import { Tables } from '../../constants'

export const shorthands: ColumnDefinitions | undefined = undefined

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.alterColumn(Tables.COMMISSIONS, 'to', {
    notNull: false
  })
  pgm.alterColumn(Tables.COMMISSIONS, 'amount', {
    type: PgType.REAL
  })
}

export async function down(pgm: MigrationBuilder): Promise<void> {}
