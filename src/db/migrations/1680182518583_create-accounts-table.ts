/* eslint-disable @typescript-eslint/naming-convention */
import { AccountType, AutharizationStatus } from '../../types/account';
import { Tables } from '../../constants';
import { MigrationBuilder, ColumnDefinitions, PgType } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createType('autharization_status', Object.values(AutharizationStatus));
  pgm.createType('account_type', Object.values(AccountType));

  pgm.createTable(Tables.ACCOUNTS, {
    id: 'id',
    type: { type: 'account_type' },
    autharization_status: { type: 'autharization_status' },
    accupation: { type: PgType.VARCHAR },
    postal_code: { type: PgType.VARCHAR },
    country: { type: PgType.VARCHAR },
    city: { type: PgType.VARCHAR },
    street_name: { type: PgType.VARCHAR },
    house_number: { type: PgType.VARCHAR },
    appartment_number: { type: PgType.VARCHAR },
    is_third_party: { type: PgType.BOOLEAN },
    third_party_full_name: { type: PgType.VARCHAR },
    is_bank_account_blocked: { type: PgType.BOOLEAN },
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
  pgm.dropTable(Tables.ACCOUNTS, { ifExists: true });
  pgm.dropType('autharization_status', { ifExists: true });
  pgm.dropType('account_type', { ifExists: true });
}
