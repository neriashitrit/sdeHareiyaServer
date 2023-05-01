/* eslint-disable @typescript-eslint/naming-convention */
import { CommissionType } from 'safe-shore-common';
import { Tables } from '../../constants';
import { MigrationBuilder, ColumnDefinitions, PgType } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createType('commission_type', Object.values(CommissionType));

  pgm.createTable(Tables.COMMISSIONS, {
    id: 'id',
    is_active: { type: PgType.BOOLEAN, notNull: true },
    from: { type: PgType.INT, notNull: true },
    to: { type: PgType.INT, notNull: true },
    type: { type: 'commission_type', notNull: true },
    amount: { type: PgType.INT, notNull: true },
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
  pgm.dropTable(Tables.COMMISSIONS, { ifExists: true });
  pgm.dropType('commission_type', { ifExists: true });
}
