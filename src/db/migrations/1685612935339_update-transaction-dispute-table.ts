/* eslint-disable @typescript-eslint/naming-convention */
import { ColumnDefinitions, MigrationBuilder, PgType } from 'node-pg-migrate'

import { Tables } from '../../constants'

export const shorthands: ColumnDefinitions | undefined = undefined

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.addColumn(Tables.TRANSACTION_DISPUTES, { admin_notes: { type: PgType.VARCHAR, notNull: false } })
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropColumn(Tables.TRANSACTION_DISPUTES, 'admin_notes')
}
