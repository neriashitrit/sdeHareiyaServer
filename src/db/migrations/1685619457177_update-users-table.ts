/* eslint-disable @typescript-eslint/naming-convention */
import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate'

import { Tables } from '../../constants'

export const shorthands: ColumnDefinitions | undefined = undefined

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.addConstraint(Tables.USERS, 'phone_number_key', { unique: 'phone_number' })
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropConstraint(Tables.USERS, 'phone_number_key')
}
