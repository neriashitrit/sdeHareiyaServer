/* eslint-disable @typescript-eslint/naming-convention */
import { TRUSTNET_TABLES } from '../../constants'
import { MigrationBuilder, ColumnDefinitions, PgType } from 'node-pg-migrate'

export const shorthands: ColumnDefinitions | undefined = undefined

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable({ schema: 'trustnet', name: TRUSTNET_TABLES.COMPANIES }, {
    id: 'id',
    company_name: { type: PgType.VARCHAR, notNull: true },
    Joining_date: { type: PgType.TIMESTAMP,default: 'NOW ()' },
    renew_date: { type: PgType.TIMESTAMP },
    active: { type: PgType.BOOLEAN, default: false },
    sector: { type: PgType.VARCHAR },
    country: { type: PgType.VARCHAR },
  })
  pgm.createTable({ schema: 'trustnet', name: TRUSTNET_TABLES.USERS }, {
    id: 'id',
    company_id: { type: PgType.INT, references: { schema: 'trustnet', name: TRUSTNET_TABLES.COMPANIES }, onDelete: 'CASCADE', notNull: true },
    first_name: { type: PgType.VARCHAR, notNull: true },
    last_name: { type: PgType.VARCHAR, notNull: true },
    position: { type: PgType.VARCHAR },
    active: { type: PgType.BOOLEAN, default: false },
    last_login: { type: PgType.TIMESTAMP },
    createdAt: { type: PgType.TIMESTAMP, default: 'NOW ()' },
    updatedAt: { type: PgType.TIMESTAMP }
  })
  pgm.createTable({ schema: 'trustnet', name: TRUSTNET_TABLES.ADMINS }, {
    id: 'id',
    related_company_ids: { type: PgType.INT, references: { schema: 'trustnet', name: TRUSTNET_TABLES.COMPANIES }, onDelete: 'NO ACTION' },
    first_name: { type: PgType.VARCHAR, notNull: true },
    last_name: { type: PgType.VARCHAR, notNull: true },
    last_login: { type: PgType.TIMESTAMP },
    createdAt: { type: PgType.TIMESTAMP, default: 'NOW ()' },
  })
  // pgm.createFunction(
  //   'update_timestamp',
  //   [],
  //   { returns: 'TRIGGER', language: 'plpgsql', replace: true },
  //   `BEGIN
  //   NEW.updated_at = now();
  //   RETURN NEW;
  // END;`
  // )
  // pgm.createTrigger(TABLES.USERS, 'save_user_update_time', {
  //   when: 'BEFORE',
  //   operation: 'UPDATE',
  //   level: 'ROW',
  //   function: 'update_timestamp'
  // })
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  // pgm.dropTrigger(TABLES.USERS, 'save_user_update_time', { ifExists: true })
  // pgm.dropFunction('update_timestamp', [], { ifExists: true })
  pgm.dropTable({ schema: 'trustnet', name: TRUSTNET_TABLES.ADMINS }, { ifExists: true })
  pgm.dropTable({ schema: 'trustnet', name: TRUSTNET_TABLES.USERS }, { ifExists: true })
  pgm.dropTable({ schema: 'trustnet', name: TRUSTNET_TABLES.COMPANIES }, { ifExists: true })
  pgm.dropSchema('trustnet', { ifExists: true })
}
