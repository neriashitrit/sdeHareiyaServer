/* eslint-disable @typescript-eslint/naming-convention */
import { ColumnDefinitions, MigrationBuilder, PgType } from 'node-pg-migrate'

import { Tables } from '../../constants'

export const shorthands: ColumnDefinitions | undefined = undefined

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable(Tables.USER_ACCOUNTS, {
    id: 'id',
    user_id: {
      type: PgType.INT,
      references: Tables.USERS,
      onDelete: 'SET NULL'
    },
    account_id: {
      type: PgType.INT,
      references: Tables.ACCOUNTS,
      onDelete: 'SET NULL'
    },
    created_at: {
      type: PgType.TIMESTAMP_WITHOUT_TIME_ZONE,
      notNull: true,
      default: pgm.func('current_timestamp')
    },
    updated_at: {
      type: PgType.TIMESTAMP_WITHOUT_TIME_ZONE,
      notNull: true,
      default: pgm.func('current_timestamp')
    }
  })
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable(Tables.USER_ACCOUNTS, { ifExists: true })
}
