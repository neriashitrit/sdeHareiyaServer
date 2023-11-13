/* eslint-disable @typescript-eslint/naming-convention */
import { ColumnDefinitions, MigrationBuilder, PgType } from 'node-pg-migrate'

import { Tables } from '../../constants'

export const shorthands: ColumnDefinitions | undefined = undefined

export async function up(pgm: MigrationBuilder): Promise<void> {

  // pgm.createTable(Tables.USERS, {
  //   id: 'id',
  //   is_activated: {
  //     type: PgType.BOOLEAN,
  //     notNull: true,
  //     default: false
  //   },
  //   is_active: { type: PgType.BOOLEAN, notNull: true, default: false },
  //   active_directory_uuid: { type: PgType.VARCHAR },
  //   role: { type: 'user_roles', default: UserRole.User },
  //   first_name: { type: PgType.VARCHAR, notNull: true },
  //   last_name: { type: PgType.VARCHAR, notNull: true },
  //   phone_number: { type: PgType.VARCHAR, notNull: true },
  //   email: { type: PgType.VARCHAR, notNull: true },
  //   id_number: { type: PgType.INT },
  //   id_number_country_of_issue: { type: PgType.VARCHAR },
  //   last_active_at: { type: PgType.TIMESTAMP_WITHOUT_TIME_ZONE, notNull: true },
  //   newsletter_subscription: { type: PgType.BOOLEAN, default: false },
  //   birthday: { type: PgType.TIMESTAMP_WITHOUT_TIME_ZONE },
  //   gender: { type: 'gender_types' },
  //   created_at: {
  //     type: PgType.TIMESTAMP_WITHOUT_TIME_ZONE,
  //     notNull: true,
  //     default: pgm.func('current_timestamp')
  //   },
  //   updated_at: {
  //     type: PgType.TIMESTAMP_WITHOUT_TIME_ZONE,
  //     notNull: true,
  //     default: pgm.func('current_timestamp')
    // }
  // })
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  // pgm.dropTable(Tables.USERS, { ifExists: true })
}
