/* eslint-disable @typescript-eslint/naming-convention */
import { COMPANIES_TABLES, insightStatus } from '../../../constants'
import { MigrationBuilder, ColumnDefinitions, PgType } from 'node-pg-migrate'

export const shorthands: ColumnDefinitions | undefined = undefined

//TODO when finish with defining the db, create the schema by request with schema name

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createType('insight_status_types', [insightStatus.RECOMMENDED_FOR_YOU, insightStatus.WAITING_FOR_WORK, insightStatus.AT_WORK, insightStatus.FINISHED])
  pgm.createTable(COMPANIES_TABLES.INSIGHT, {
    id: 'id',
    title: { type: PgType.VARCHAR, notNull: true },
    status: { type: 'insight_status_types' },
    priority: { type: PgType.VARCHAR },
    summary: { type: PgType.VARCHAR },
    description: { type: PgType.VARCHAR },
    is_relevant: { type: PgType.BOOLEAN },
    created: { type: PgType.TIMESTAMP, default: 'NOW ()' },
  })
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable(COMPANIES_TABLES.INSIGHT, { ifExists: true })
  pgm.dropType('insight_status_types', { ifExists: true })
}
