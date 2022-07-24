/* eslint-disable @typescript-eslint/naming-convention */
import { Knex } from 'knex'


//TODO when finish with defining the db, create the schema by request with schema name

export async function up(knex: Knex): Promise<void> {
  knex.schema.createTable('users', function (table) {
    table.increments();
    table.string('team_id').index().unique();
    table.string('anodot_token');
    table.string('anodot_api_token');
    table.json('installation');
    table.timestamps(true, true);
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropSchema('publics');
}
