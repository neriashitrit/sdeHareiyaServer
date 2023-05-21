/* eslint-disable @typescript-eslint/naming-convention */
import { ColumnDefinitions, MigrationBuilder, PgType } from 'node-pg-migrate'
import { TransactionStageName, TransactionStageStatus } from 'safe-shore-common'

import { Tables } from '../../constants'

export const shorthands: ColumnDefinitions | undefined = undefined

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createType('transaction_stage_name', Object.values(TransactionStageName))
  pgm.createType('transaction_stage_status', Object.values(TransactionStageStatus))
  pgm.createTable(Tables.TRANSACTION_STAGES, {
    id: 'id',
    transaction_id: {
      type: PgType.INT,
      references: Tables.TRANSACTIONS,
      onDelete: 'SET NULL'
    },
    name: { type: 'transaction_stage_name', notNull: true },
    in_charge: { type: 'transaction_side', notNull: true },
    user_id: {
      type: PgType.INT,
      references: Tables.USERS,
      onDelete: 'SET NULL'
    },
    status: { type: 'transaction_stage_status', notNull: true },
    additional_data: { type: PgType.VARCHAR },
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
  pgm.dropTable(Tables.TRANSACTION_STAGES, { ifExists: true, cascade: true })
  pgm.dropType('transaction_stage_name', { ifExists: true })
  pgm.dropType('transaction_stage_status', { ifExists: true })
}
