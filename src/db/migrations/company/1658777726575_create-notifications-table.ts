/* eslint-disable @typescript-eslint/naming-convention */
import { COMPANIES_TABLES, notificationStatus } from '../../../constants'
import { MigrationBuilder, ColumnDefinitions, PgType } from 'node-pg-migrate'

export const shorthands: ColumnDefinitions | undefined = undefined

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createType('notification_status_types', 
        [notificationStatus.NEW_INCIDENT, notificationStatus.NEW_TASK, notificationStatus.NEW_INSIGHT, notificationStatus.INCIDENT_CHANGED, notificationStatus.TASK_CHANGED])
    pgm.createTable(COMPANIES_TABLES.NOTIFICATION, {
        id: 'id',
        title: { type: PgType.VARCHAR, notNull: true },
        description: { type: PgType.VARCHAR },
        trigger: { type: 'notification_status_types' },
        created_at: { type: PgType.TIMESTAMP_WITHOUT_TIME_ZONE, default: pgm.func('current_timestamp') },
        updated_at: { type: PgType.TIMESTAMP_WITHOUT_TIME_ZONE, default: pgm.func('current_timestamp') },
    })
    pgm.createTrigger(COMPANIES_TABLES.NOTIFICATION, 'save_notification_update_time', {
        when: 'BEFORE',
        operation: 'UPDATE',
        level: 'ROW',
        function: 'update_timestamp'
    })  
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropTrigger(COMPANIES_TABLES.NOTIFICATION, 'save_notification_update_time', { ifExists: true })
    pgm.dropTable(COMPANIES_TABLES.NOTIFICATION, { ifExists: true })
    pgm.dropType('notification_status_types', { ifExists: true })
}
