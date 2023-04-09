/* eslint-disable @typescript-eslint/naming-convention */
import { Tables } from '../../constants';
import { MigrationBuilder, ColumnDefinitions, PgType } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable(Tables.BANK_DETAILS, {
    id: 'id',
    account: {
      type: PgType.INT,
      references: Tables.ACCOUNTS,
      onDelete: 'SET NULL',
      notNull: false,
    },
    is_active: { type: PgType.BOOLEAN },
    bank_name: { type: PgType.VARCHAR },
    branch_name: { type: PgType.VARCHAR },
    branch_number: { type: PgType.INT },
    bank_account_owner_full_name: { type: PgType.VARCHAR },
    bank_account_owner_id: { type: PgType.INT },
    bank_account_number: { type: PgType.INT },
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
  pgm.dropTable(Tables.BANK_DETAILS, { ifExists: true });
}
