/* eslint-disable @typescript-eslint/naming-convention */
import { COMPANIES_TABLES, taskStatus } from '../../../constants'
import { Knex} from 'knex'
import { MigrationBuilder, PgType } from 'node-pg-migrate'

// import { MigrationBuilder, ColumnDefinitions, PgType } from 'node-pg-migrate'

// export const shorthands: ColumnDefinitions | undefined = undefined

//TODO when finish with defining the db, create the schema by request with schema name



// export async function up(knex: Knex): Promise<void> {
//   knex.schema.createTable("COMPANIES_TABLES.TASK", (table: Knex.CreateTableBuilder) => {
//     table.increments('id');
//     table.string('title').notNullable();
//     table.string('summary');
//     table.string('description');
//     table.enu('status', [taskStatus.OPEN, taskStatus.IN_PROGRESS, taskStatus.CLOSE], { useNative: true, enumName: 'task_status_types' })
//     table.string('priority');
//     table.string('owner');
//     table.boolean('is_relevant');
//     table.timestamps(true, true);
//   })
// }

// export async function down(knex: Knex): Promise<void> {
//   await knex.schema.dropTable(COMPANIES_TABLES.TASK);
// }

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createType('task_status_types', [taskStatus.OPEN, taskStatus.IN_PROGRESS, taskStatus.CLOSE])
  pgm.createTable(COMPANIES_TABLES.TASK, {
    id: 'id',
    title: { type: PgType.VARCHAR, notNull: true },
    summary: { type: PgType.VARCHAR },
    description: { type: PgType.VARCHAR },
    status: { type: 'task_status_types' },
    priority: { type: PgType.VARCHAR },
    owner: { type: PgType.VARCHAR },
    is_relevant: { type: PgType.BOOLEAN },
    created: { type: PgType.TIMESTAMP, default: 'NOW ()' },
  })
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable(COMPANIES_TABLES.TASK, { ifExists: true })
  pgm.dropType('task_status_types', { ifExists: true })
}
