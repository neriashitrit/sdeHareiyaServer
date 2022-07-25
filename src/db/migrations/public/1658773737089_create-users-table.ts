/* eslint-disable @typescript-eslint/naming-convention */
import { TRUSTNET_TABLES } from '../../../constants'
import { MigrationBuilder, ColumnDefinitions, PgType } from 'node-pg-migrate'

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable(TRUSTNET_TABLES.USERS, {
        id: 'id',
        company_id: {
          type: PgType.INT,
          references: TRUSTNET_TABLES.COMPANY,
          onDelete: 'CASCADE',
          notNull: true
        },
        email: { type: PgType.VARCHAR, notNull: true, unique: true }, 
        first_name: { type: PgType.VARCHAR, notNull: true },
        last_name: { type: PgType.VARCHAR, notNull: true },
        position: { type: PgType.VARCHAR },
        last_login: { type: PgType.TIMESTAMP },
        active: { type: PgType.BOOLEAN, default: true, notNull: true },
        created_at: { type: PgType.TIMESTAMP_WITHOUT_TIME_ZONE, default: 'NOW ()' },
        updated_at: { type: PgType.TIMESTAMP_WITHOUT_TIME_ZONE, default: 'NOW ()' },
      })
      pgm.createTrigger(TRUSTNET_TABLES.COMPANY, 'save_users_update_time', {
        when: 'BEFORE',
        operation: 'UPDATE',
        level: 'ROW',
        function: 'update_timestamp'
      })
    }
    
export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTrigger(TRUSTNET_TABLES.USERS, 'save_users_update_time', { ifExists: true })
  pgm.dropTable({ name: TRUSTNET_TABLES.USERS }, { ifExists: true })
}
