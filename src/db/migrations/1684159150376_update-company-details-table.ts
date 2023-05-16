/* eslint-disable @typescript-eslint/naming-convention */
import { Tables } from '../../constants';
import { MigrationBuilder, ColumnDefinitions, PgType } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.renameColumn(
    Tables.COMPANY_DETAILS,
    'company_id_number',
    'company_identity_number'
  );
  pgm.renameColumn(
    Tables.COMPANY_DETAILS,
    'company_name',
    'incorporation_name'
  );
  pgm.renameColumn(Tables.COMPANY_DETAILS, 'running_years', 'active_years');
  pgm.addColumn(Tables.COMPANY_DETAILS, { purpose: { type: PgType.VARCHAR } });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.renameColumn(
    Tables.COMPANY_DETAILS,
    'company_identity_number',
    'company_id_number'
  );
  pgm.renameColumn(
    Tables.COMPANY_DETAILS,
    'incorporation_name',
    'company_name'
  );
  pgm.renameColumn(Tables.COMPANY_DETAILS, 'active_years', 'running_years');
  pgm.dropColumn(Tables.COMPANY_DETAILS, 'purpose');
}
