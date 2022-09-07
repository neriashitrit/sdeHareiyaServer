/* eslint-disable @typescript-eslint/naming-convention */
import { COMPANIES_TABLES } from '../../../constants'
import { MigrationBuilder, ColumnDefinitions, PgType } from 'node-pg-migrate'

export const shorthands: ColumnDefinitions | undefined = undefined

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable(COMPANIES_TABLES.SOURCE_IP, {
        id: 'id',
        ip: { type: PgType.VARCHAR, notNull: true },
        description: { type: PgType.VARCHAR, notNull: true },
        created_at: { type: PgType.TIMESTAMP_WITHOUT_TIME_ZONE, default: pgm.func('current_timestamp') },
        updated_at: { type: PgType.TIMESTAMP_WITHOUT_TIME_ZONE, default: pgm.func('current_timestamp') },
    })
    pgm.createTrigger(COMPANIES_TABLES.SOURCE_IP, 'save_source_ip_update_time', {
        when: 'BEFORE',
        operation: 'UPDATE',
        level: 'ROW',
        function: 'update_timestamp'
    })  
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropTable(COMPANIES_TABLES.SOURCE_IP, { ifExists: true })
    pgm.dropTrigger(COMPANIES_TABLES.SOURCE_IP, 'save_source_ip_update_time', { ifExists: true })
}
