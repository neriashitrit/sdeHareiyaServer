/* eslint-disable @typescript-eslint/naming-convention */
import { COMPANIES_TABLES } from '../../../constants'
import { MigrationBuilder, ColumnDefinitions, PgType } from 'node-pg-migrate'

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable(COMPANIES_TABLES.IMAGE, {
        id: 'id',
        url: { type: PgType.VARCHAR, notNull: true },
        key: { type: PgType.VARCHAR, notNull: true, default:0},
        created_at: { type: PgType.TIMESTAMP_WITHOUT_TIME_ZONE, default: pgm.func('current_timestamp') },
        updated_at: { type: PgType.TIMESTAMP_WITHOUT_TIME_ZONE, default: pgm.func('current_timestamp') },
      })
      pgm.createTrigger(COMPANIES_TABLES.IMAGE, 'save_image_update_time', {
          when: 'BEFORE',
          operation: 'UPDATE',
          level: 'ROW',
          function: 'update_timestamp'
      })
      pgm.addColumn(COMPANIES_TABLES.INSIGHT, 
        {image_id: {
            type: PgType.INT,
            references: COMPANIES_TABLES.IMAGE,
            onDelete: 'SET NULL',
        },})
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropTrigger(COMPANIES_TABLES.IMAGE, 'save_image_update_time', { ifExists: true })
    pgm.dropTable(COMPANIES_TABLES.IMAGE, { ifExists: true })
    pgm.dropColumn(COMPANIES_TABLES.INSIGHT, 'image_id', { ifExists: true })
}
