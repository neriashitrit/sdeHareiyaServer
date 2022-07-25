/* eslint-disable @typescript-eslint/naming-convention */
import { COMPANIES_TABLES, deviceStatus } from '../../../constants'
import { MigrationBuilder, ColumnDefinitions, PgType } from 'node-pg-migrate'

export const shorthands: ColumnDefinitions | undefined = undefined

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createType('device_status_types', 
        [deviceStatus.CONNECTED, deviceStatus.NOT_CONNECTED])
    pgm.createTable(COMPANIES_TABLES.MONITORED_DEVICE, {
        id: 'id',
        status: { type: 'device_status_types' },
        count: { type: PgType.INT, notNull: true },
        device_type: { type: PgType.VARCHAR, notNull: true },
        created_at: { type: PgType.TIMESTAMP_WITHOUT_TIME_ZONE, default: 'NOW ()' },
        updated_at: { type: PgType.TIMESTAMP_WITHOUT_TIME_ZONE, default: 'NOW ()' },
    })
    pgm.createTrigger(COMPANIES_TABLES.MONITORED_DEVICE, 'save_monitored_device_update_time', {
        when: 'BEFORE',
        operation: 'UPDATE',
        level: 'ROW',
        function: 'update_timestamp'
    })  
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropTrigger(COMPANIES_TABLES.MONITORED_DEVICE, 'save_monitored_device_update_time', { ifExists: true })
    pgm.dropTable(COMPANIES_TABLES.MONITORED_DEVICE, { ifExists: true })
    pgm.dropType('device_status_types', { ifExists: true })
}
