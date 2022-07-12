// /* eslint-disable @typescript-eslint/naming-convention */
// import { TABLES, UserRole } from '../../constants'
// import { MigrationBuilder, ColumnDefinitions, PgType } from 'node-pg-migrate'

// export const shorthands: ColumnDefinitions | undefined = undefined

// export async function up(pgm: MigrationBuilder): Promise<void> {
//   pgm.createType('role_types', [UserRole.ADMIN, UserRole.USER, UserRole.SALE_REP])
//   pgm.createTable(TABLES.USERS, {
//     id: 'id',
//     first_name: { type: PgType.VARCHAR },
//     last_name: { type: PgType.VARCHAR },
//     email: { type: PgType.VARCHAR, unique: true, notNull: true },
//     active: { type: PgType.BOOLEAN, default: false },
//     role: { type: 'role_types' },
//     logged_in_at: { type: PgType.TIMESTAMP },
//     createdAt: { type: PgType.TIMESTAMP, default: 'NOW ()' },
//     updatedAt: { type: PgType.TIMESTAMP, default: 'NOW ()' }
//   })
//   pgm.createFunction(
//     'update_timestamp',
//     [],
//     { returns: 'TRIGGER', language: 'plpgsql', replace: true },
//     `BEGIN
//     NEW.updated_at = now();
//     RETURN NEW;
//   END;`
//   )
//   pgm.createTrigger(TABLES.USERS, 'save_user_update_time', {
//     when: 'BEFORE',
//     operation: 'UPDATE',
//     level: 'ROW',
//     function: 'update_timestamp'
//   })
// }

// export async function down(pgm: MigrationBuilder): Promise<void> {
//   pgm.dropTrigger(TABLES.USERS, 'save_user_update_time', { ifExists: true })
//   pgm.dropFunction('update_timestamp', [], { ifExists: true })
//   pgm.dropTable(TABLES.USERS, { ifExists: true })
//   pgm.dropType('role_types', { ifExists: true })
// }
