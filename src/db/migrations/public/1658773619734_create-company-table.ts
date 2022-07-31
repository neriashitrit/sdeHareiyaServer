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
    joining_date: { type: PgType.TIMESTAMP_WITHOUT_TIME_ZONE, default: 'NOW ()' },// + INTERVAL 1 YEAR
    created_at: { type: PgType.TIMESTAMP_WITHOUT_TIME_ZONE, default: 'NOW ()' },
    updated_at: { type: PgType.TIMESTAMP_WITHOUT_TIME_ZONE, default: 'NOW ()' },
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
  pgm.dropTable({ name: TRUSTNET_TABLES.COMPANY }, { ifExists: true })
}
