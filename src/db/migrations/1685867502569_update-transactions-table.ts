/* eslint-disable @typescript-eslint/naming-convention */
import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate'

export const shorthands: ColumnDefinitions | undefined = undefined

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.alterSequence('transactions_id_seq', { restart: 10000 })
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropSequence('transactions_id_seq')
}
