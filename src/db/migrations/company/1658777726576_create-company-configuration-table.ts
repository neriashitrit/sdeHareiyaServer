/* eslint-disable @typescript-eslint/naming-convention */
import { COMPANIES_TABLES, SLASeverity } from '../../../constants'
import { MigrationBuilder, ColumnDefinitions, PgType } from 'node-pg-migrate'

export const shorthands: ColumnDefinitions | undefined = undefined

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createType('sla_severity_types', 
    [SLASeverity.INFO, SLASeverity.MEDIUM, SLASeverity.HIGH, SLASeverity.CRITICAL ])
    pgm.createTable(COMPANIES_TABLES.SLA, {
        response_time_minutes: { type: PgType.INT, notNull: true },
        severity: { type: 'sla_severity_types', unique:true, notNull: true },
        created_at: { type: PgType.TIMESTAMP_WITHOUT_TIME_ZONE, default: 'NOW ()' },
        updated_at: { type: PgType.TIMESTAMP_WITHOUT_TIME_ZONE, default: 'NOW ()' },
    })
    pgm.createTrigger(COMPANIES_TABLES.SLA, 'save_sla_update_time', {
        when: 'BEFORE',
        operation: 'UPDATE',
        level: 'ROW',
        function: 'update_timestamp'
    })  
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropTable(COMPANIES_TABLES.SLA, { ifExists: true })
    pgm.dropTrigger(COMPANIES_TABLES.SLA, 'save_sla_update_time', { ifExists: true })
    pgm.dropType('sla_severity_types', { ifExists: true })

}
