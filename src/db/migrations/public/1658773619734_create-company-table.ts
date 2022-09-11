/* eslint-disable @typescript-eslint/naming-convention */
import { TRUSTNET_TABLES } from '../../../constants'
import { MigrationBuilder, ColumnDefinitions, PgType } from 'node-pg-migrate'

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable(TRUSTNET_TABLES.COMPANY, {
    id: 'id',
    company_name: { type: PgType.VARCHAR, unique:true, notNull: true},
    sector: { type: PgType.VARCHAR },
    area_timestamp: { type: PgType.VARCHAR },
    api_key: { type: PgType.VARCHAR, notNull: true },
    active: { type: PgType.BOOLEAN, default: true, notNull: true },
    renew_date: { type: PgType.TIMESTAMP_WITHOUT_TIME_ZONE, default: 'NOW ()'  }, // change to date + 1 year
    joining_date: { type: PgType.TIMESTAMP_WITHOUT_TIME_ZONE, default: pgm.func('current_timestamp') },
    created_at: { type: PgType.TIMESTAMP_WITHOUT_TIME_ZONE, default: pgm.func('current_timestamp') },
    updated_at: { type: PgType.TIMESTAMP_WITHOUT_TIME_ZONE, default: pgm.func('current_timestamp') },
  })
  pgm.createTrigger(TRUSTNET_TABLES.COMPANY, 'save_company_update_time', {
    when: 'BEFORE',
    operation: 'UPDATE',
    level: 'ROW',
    function: 'update_timestamp'
  })
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTrigger(TRUSTNET_TABLES.USERS, 'save_company_update_time', { ifExists: true })
  pgm.dropTable(TRUSTNET_TABLES.COMPANY, { ifExists: true })
}
