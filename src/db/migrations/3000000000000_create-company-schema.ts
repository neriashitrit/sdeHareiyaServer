/* eslint-disable @typescript-eslint/naming-convention */
import { COMPANIES_TABLES, TRUSTNET_TABLES, UserRole } from '../../constants'
import { MigrationBuilder, ColumnDefinitions, PgType } from 'node-pg-migrate'

export const shorthands: ColumnDefinitions | undefined = undefined

//TODO when finish with defining the db, create the schema by request with schema name

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createSchema('spectory')
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
  pgm.dropSchema('spectory', { ifExists: true })
}
