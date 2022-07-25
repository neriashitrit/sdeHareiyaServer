/* eslint-disable @typescript-eslint/naming-convention */
import { COMPANIES_TABLES, IncidentStatus, IncidentSeverity } from '../../../constants'
import { MigrationBuilder, ColumnDefinitions, PgType } from 'node-pg-migrate'

export const shorthands: ColumnDefinitions | undefined = undefined

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createType('incident_status_types', 
    [IncidentStatus.OPEN, IncidentStatus.IN_PROGRESS, IncidentStatus.WAITING, IncidentStatus.CLOSE])
  pgm.createType('severity_types', 
    [IncidentSeverity.RARE, IncidentSeverity.LOW, IncidentSeverity.MEDIUM, IncidentSeverity.HIGH, IncidentSeverity.EXTREME, ])
  pgm.createTable(COMPANIES_TABLES.INCIDENT, {
    id: 'id',
    external_id: { type: PgType.INT, unique:true, notNull: true },
    incident_name: { type: PgType.VARCHAR, notNull: true },
    severity: { type: 'severity_types' },
    closing_Reason: { type: PgType.VARCHAR }, 
    category_name: { type: PgType.VARCHAR },
    title: { type: PgType.VARCHAR, notNull: true },
    summary: { type: PgType.VARCHAR },
    description: { type: PgType.VARCHAR },
    mitre_tactic: { type: PgType.VARCHAR },
    investigation: { type: PgType.VARCHAR },
    owner: { type: PgType.VARCHAR }, // check
    origin: { type: PgType.VARCHAR },
    host_name: { type: PgType.VARCHAR },
    renew_date: { type: PgType.TIMESTAMP },
    source_user: { type: PgType.VARCHAR },
    destination_user: { type: PgType.VARCHAR },
    analyst_name: { type: PgType.VARCHAR },
    source_ip: { type: PgType.VARCHAR },
    destination_ip: { type: PgType.VARCHAR },
    source_geo: { type: PgType.VARCHAR },
    destination_geo: { type: PgType.VARCHAR },
    sector: { type: PgType.VARCHAR },
    sla_assign: { type: PgType.TIMESTAMP },
    sla_initial_triage: { type: PgType.TIMESTAMP },
    sla_time_to_resolve: { type: PgType.TIMESTAMP },
    status: { type: 'incident_status_types' },
    is_active: { type: PgType.BOOLEAN, default: true, notNull: true },
    created_at: { type: PgType.TIMESTAMP, default: 'NOW ()' },
    updated_at: { type: PgType.TIMESTAMP, default: 'NOW ()' },
    })
    pgm.createTrigger(COMPANIES_TABLES.INCIDENT, 'save_incident_update_time', {
        when: 'BEFORE',
        operation: 'UPDATE',
        level: 'ROW',
        function: 'update_timestamp'
    })    
}


export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropTrigger(COMPANIES_TABLES.INCIDENT, 'save_incident_update_time', { ifExists: true })
    pgm.dropTable(COMPANIES_TABLES.INCIDENT, { ifExists: true })
    pgm.dropType('status_types', { ifExists: true })
    pgm.dropType('severity_types', { ifExists: true })
}
