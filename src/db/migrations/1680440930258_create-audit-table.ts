/* eslint-disable @typescript-eslint/naming-convention */
import { Tables } from '../../constants';
import { MigrationBuilder, ColumnDefinitions, PgType } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable(Tables.AUDIT, {
    id: 'id',
    user_id: {
      type: PgType.INT,
      references: Tables.USERS,
      onDelete: 'SET NULL',
    },
    table_name: { type: PgType.VARCHAR, notNull: true },
    row_id: { type: PgType.INT, notNull: true },
    changed_fields: { type: PgType.JSONB, notNull: true },
    modified_at: {
      type: PgType.TIMESTAMP_WITHOUT_TIME_ZONE,
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    created_at: {
      type: PgType.TIMESTAMP_WITHOUT_TIME_ZONE,
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable(Tables.AUDIT, { ifExists: true });
}