/* eslint-disable @typescript-eslint/naming-convention */
import { Tables } from '../../constants';
import { MigrationBuilder, ColumnDefinitions, PgType } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.alterColumn(Tables.COMPANY_DETAILS, 'company_identity_number', {
    type: PgType.VARCHAR,
  });
  pgm.alterColumn(Tables.COMPANY_DETAILS, 'active_years', {
    type: PgType.VARCHAR,
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.alterColumn(Tables.COMPANY_DETAILS, 'company_identity_number', {
    type: PgType.INT,
  });
  pgm.alterColumn(Tables.COMPANY_DETAILS, 'active_years', {
    type: PgType.INT,
  });
}
