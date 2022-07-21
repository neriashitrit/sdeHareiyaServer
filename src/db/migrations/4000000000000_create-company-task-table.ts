/* eslint-disable @typescript-eslint/naming-convention */
import { COMPANIES_TABLES, taskStatus } from '../../constants'
import { MigrationBuilder, ColumnDefinitions, PgType } from 'node-pg-migrate'

export const shorthands: ColumnDefinitions | undefined = undefined

//TODO when finish with defining the db, create the schema by request with schema name

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createType('task_status_types', [taskStatus.OPEN, taskStatus.IN_PROGRESS, taskStatus.CLOSE])
  pgm.createTable({ schema: 'spectory', name: COMPANIES_TABLES.TASK }, {
    id: 'id',
    title: { type: PgType.VARCHAR, notNull: true },
    summary: { type: PgType.VARCHAR },
    description: { type: PgType.VARCHAR },
    status: { type: 'task_status_types' },
    priority: { type: PgType.VARCHAR },
    owner: { type: PgType.VARCHAR },
    is_relevant: { type: PgType.BOOLEAN },
    created: { type: PgType.TIMESTAMP, default: 'NOW ()' },
  })
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable({ schema: 'spectory', name: COMPANIES_TABLES.TASK }, { ifExists: true })
  pgm.dropType('task_status_types', { ifExists: true })
}
