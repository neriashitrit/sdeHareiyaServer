/* eslint-disable @typescript-eslint/naming-convention */
import { ColumnDefinitions, MigrationBuilder, PgType } from 'node-pg-migrate'

import { Tables } from '../../constants'

export const shorthands: ColumnDefinitions | undefined = undefined

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable(Tables.TRANSACTION_DISPUTES, {
    id: 'id',
    is_completed: { type: PgType.BOOLEAN, notNull: true },
    transaction_id: {
      type: PgType.INT,
      references: Tables.TRANSACTIONS,
      onDelete: 'SET NULL'
    },
    requesting_side: { type: 'transaction_side', notNull: true },
    user_id: {
      type: PgType.INT,
      references: Tables.USERS,
      onDelete: 'SET NULL'
    },
    reason: { type: PgType.VARCHAR, notNull: true },
    reasonOther: { type: PgType.VARCHAR },
    notes: { type: PgType.VARCHAR },
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
  pgm.dropTable(Tables.TRANSACTION_DISPUTES, { ifExists: true, cascade: true })
}
