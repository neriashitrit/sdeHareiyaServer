/* eslint-disable @typescript-eslint/naming-convention */
import { TRUSTNET_TABLES } from '../../../constants'
import { MigrationBuilder, ColumnDefinitions, PgType } from 'node-pg-migrate'

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable(TRUSTNET_TABLES.IMAGE, {
        id: 'id',
        url: { type: PgType.VARCHAR, notNull: true },
        key: { type: PgType.VARCHAR, notNull: true, default:0},
        created_at: { type: PgType.TIMESTAMP_WITHOUT_TIME_ZONE, default: pgm.func('current_timestamp') },
        updated_at: { type: PgType.TIMESTAMP_WITHOUT_TIME_ZONE, default: pgm.func('current_timestamp') },
      })
    pgm.createTrigger(TRUSTNET_TABLES.IMAGE, 'save_trustnet_image_update_time', {
        when: 'BEFORE',
        operation: 'UPDATE',
        level: 'ROW',
        function: 'update_timestamp'
      })
    pgm.addColumn(TRUSTNET_TABLES.USERS, 
        {image_id: {
        type: PgType.INT,
        references: TRUSTNET_TABLES.IMAGE,
        onDelete: 'SET NULL',
        },})
    pgm.addColumn(TRUSTNET_TABLES.COMPANY, 
        {image_id: {
        type: PgType.INT,
        references: TRUSTNET_TABLES.IMAGE,
        onDelete: 'SET NULL',
        },})
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropTrigger(TRUSTNET_TABLES.IMAGE, 'save_trustnet_image_update_time', { ifExists: true })
    pgm.dropTable(TRUSTNET_TABLES.IMAGE, { ifExists: true })
    pgm.dropColumn(TRUSTNET_TABLES.USERS, 'image_id', { ifExists: true })
    pgm.dropColumn(TRUSTNET_TABLES.COMPANY, 'image_id', { ifExists: true })
}
