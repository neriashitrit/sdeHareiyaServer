/* eslint-disable @typescript-eslint/naming-convention */
import { FundsSource } from '../../types/companyDetails';
import { Tables } from '../../constants';
import { MigrationBuilder, ColumnDefinitions, PgType } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createType('funds_source', Object.values(FundsSource));

  pgm.createTable(Tables.COMPANY_DETAILS, {
    id: 'id',
    account: {
      type: PgType.INT,
      references: Tables.ACCOUNTS,
      onDelete: 'SET NULL',
      notNull: false,
      unique: true,
    },
    company_id_number: { type: PgType.INT, notNull: true },
    company_name: { type: PgType.VARCHAR, notNull: true },
    incorporation_date: {
      type: PgType.TIMESTAMP_WITHOUT_TIME_ZONE,
      notNull: true,
    },
    incorporation_country: { type: PgType.VARCHAR, notNull: true },
    running_years: { type: PgType.INT, notNull: true },
    funds_source: { type: 'funds_source', notNull: true },
    funds_source_other: { type: PgType.VARCHAR },
    contacts: { type: PgType.JSONB, notNull: true },
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
  pgm.addColumn(Tables.ACCOUNTS, {
    company_details: {
      type: PgType.INT,
      references: Tables.COMPANY_DETAILS,
      onDelete: 'SET NULL',
      notNull: false,
    },
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable(Tables.COMPANY_DETAILS, { ifExists: true, cascade: true });
  pgm.dropType('funds_source', { ifExists: true });
}
