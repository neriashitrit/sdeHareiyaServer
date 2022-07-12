// /* eslint-disable @typescript-eslint/naming-convention */
// import { TABLES } from '../../constants'
// import { MigrationBuilder, ColumnDefinitions, PgType } from 'node-pg-migrate'

// export const shorthands: ColumnDefinitions | undefined = undefined

// export async function up(pgm: MigrationBuilder): Promise<void> {
//   pgm.createTable(TABLES.USER_TENANTS, {
//     id: 'id',
//     user_id: { type: PgType.INTEGER, references: TABLES.USERS, onDelete: 'CASCADE' },
//     tenant_id: {
//       type: PgType.INTEGER,
//       references: TABLES.TENANTS,
//       onDelete: 'CASCADE'
//     },
//     assigned_by: { type: PgType.INTEGER, references: TABLES.USERS, onDelete: 'CASCADE' },
//     createdAt: { type: PgType.TIMESTAMP, default: 'NOW ()' }
//   })
// }

// export async function down(pgm: MigrationBuilder): Promise<void> {
//   pgm.dropTable(TABLES.USER_TENANTS, { ifExists: true })
// }
