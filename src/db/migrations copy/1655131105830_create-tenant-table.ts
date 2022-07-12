// /* eslint-disable @typescript-eslint/naming-convention */
// import { TABLES } from '../../constants'
// import { MigrationBuilder, ColumnDefinitions, PgType } from 'node-pg-migrate'

// export const shorthands: ColumnDefinitions | undefined = undefined

// export async function up(pgm: MigrationBuilder): Promise<void> {
//   pgm.createTable(TABLES.TENANTS, {
//     id: 'id',
//     name: { type: PgType.VARCHAR, unique: true, notNull: true },
//     createdAt: { type: PgType.TIMESTAMP, default: 'NOW ()' },
//     updatedAt: { type: PgType.TIMESTAMP, default: 'NOW ()' }
//   })
//   pgm.createTrigger(TABLES.USERS, 'save_tenant_update_time', {
//     when: 'BEFORE',
//     operation: 'UPDATE',
//     level: 'ROW',
//     function: 'update_timestamp'
//   })
// }

// export async function down(pgm: MigrationBuilder): Promise<void> {
//   pgm.dropTrigger(TABLES.USERS, 'save_tenant_update_time', { ifExists: true })
//   pgm.dropTable(TABLES.TENANTS, { ifExists: true })
// }
