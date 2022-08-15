/* eslint-disable @typescript-eslint/naming-convention */
import { COMPANIES_TABLES } from '../../../constants'
import { MigrationBuilder, ColumnDefinitions, PgType } from 'node-pg-migrate'

export const shorthands: ColumnDefinitions | undefined = undefined

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable(COMPANIES_TABLES.CONFIGURATION, {
        falsePositiveRateFirst: { type: PgType.VARCHAR },
        falsePositiveRateSecond: { type: PgType.VARCHAR },
        falsePositiveRateThird: { type: PgType.VARCHAR },
        created_at: { type: PgType.TIMESTAMP_WITHOUT_TIME_ZONE, default: pgm.func('current_timestamp') },
        updated_at: { type: PgType.TIMESTAMP_WITHOUT_TIME_ZONE, default: pgm.func('current_timestamp') },
    })
    pgm.createTrigger(COMPANIES_TABLES.CONFIGURATION, 'save_configuration_update_time', {
        when: 'BEFORE',
        operation: 'UPDATE',
        level: 'ROW',
        function: 'update_timestamp'
    })  
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropTable(COMPANIES_TABLES.CONFIGURATION, { ifExists: true })
    pgm.dropTrigger(COMPANIES_TABLES.CONFIGURATION, 'save_configuration_update_time', { ifExists: true })
}
