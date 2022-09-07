/* eslint-disable @typescript-eslint/naming-convention */
import { COMPANIES_TABLES} from '../../../constants'
import { MigrationBuilder, ColumnDefinitions, PgType } from 'node-pg-migrate'
export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.addColumn(COMPANIES_TABLES.SOURCE_IP, 
        {id: 'id'})
}
export async function down(pgm: MigrationBuilder): Promise<void> {
}
