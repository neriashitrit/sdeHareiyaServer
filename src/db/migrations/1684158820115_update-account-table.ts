/* eslint-disable @typescript-eslint/naming-convention */
import { Tables } from '../../constants';
import { MigrationBuilder, ColumnDefinitions, PgType } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.dropColumn(Tables.ACCOUNTS, 'company_details');
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.addColumn(Tables.ACCOUNTS, {
    company_details: {
      type: PgType.INT,
      references: Tables.COMPANY_DETAILS,
      onDelete: 'SET NULL',
    },
  });
}
