/* eslint-disable @typescript-eslint/naming-convention */
import { Tables } from '../../constants';
import { MigrationBuilder, ColumnDefinitions, PgType } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable(Tables.USERS_ACCOUNTS, {
    id: 'id',
    user: {
      type: PgType.INT,
      references: Tables.USERS,
      onDelete: 'SET NULL',
      notNull: false,
    },
    account: {
      type: PgType.INT,
      references: Tables.ACCOUNTS,
      onDelete: 'SET NULL',
      notNull: false,
    },
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
  pgm.dropTable(Tables.USERS_ACCOUNTS, { ifExists: true });
}
