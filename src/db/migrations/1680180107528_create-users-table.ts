/* eslint-disable @typescript-eslint/naming-convention */
import { UserRole } from '../../types/user';
import { Tables } from '../../constants';
import { MigrationBuilder, ColumnDefinitions, PgType } from 'node-pg-migrate';
import { Gender } from '../../types/enums';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createType('user_roles', Object.values(UserRole));
  pgm.createType('gender_types', Object.values(Gender));

  pgm.createTable(Tables.USERS, {
    id: 'id',
    active_directory_uuid: { type: PgType.VARCHAR, notNull: true },
    role: { type: 'user_roles', notNull: true },
    first_name: { type: PgType.VARCHAR, notNull: true },
    last_name: { type: PgType.VARCHAR, notNull: true },
    phone_number: { type: PgType.VARCHAR, notNull: true },
    email: { type: PgType.VARCHAR, notNull: true },
    id_number: { type: PgType.INT },
    id_number_country_of_issue: { type: PgType.VARCHAR },
    last_active_at: { type: PgType.TIMESTAMP_WITHOUT_TIME_ZONE, notNull: true },
    newsletter_subscription: { type: PgType.BOOLEAN, notNull: true },
    birthday: { type: PgType.TIMESTAMP_WITHOUT_TIME_ZONE },
    gender: { type: 'gender_types' },
    created_at: {
      type: PgType.TIMESTAMP_WITHOUT_TIME_ZONE,
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: PgType.TIMESTAMP_WITHOUT_TIME_ZONE,
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable(Tables.USERS, { ifExists: true });
  pgm.dropType('user_roles', { ifExists: true });
  pgm.dropType('gender_types', { ifExists: true });
}
