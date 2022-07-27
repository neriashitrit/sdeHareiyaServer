/* eslint-disable @typescript-eslint/naming-convention */
import { TRUSTNET_TABLES } from '../../../constants'
import { MigrationBuilder, ColumnDefinitions, PgType } from 'node-pg-migrate'

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable(TRUSTNET_TABLES.ADMIN_COMPANY, {
        id: 'id',
        user_id: {
            type: PgType.INT,
            references: TRUSTNET_TABLES.USERS,
            onDelete: 'CASCADE',
            notNull: true
        },
        company_id: {
            type: PgType.INT,
            references: TRUSTNET_TABLES.COMPANY,
            onDelete: 'CASCADE',
            notNull: true
        },
    })
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropTable({ name: TRUSTNET_TABLES.ADMIN_COMPANY }, { ifExists: true })
}
