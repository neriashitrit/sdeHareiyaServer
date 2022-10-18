import { COMPANIES_TABLES, TRUSTNET_SCHEMA, TRUSTNET_TABLES } from '../../../constants'
import { MigrationBuilder, ColumnDefinitions, PgType } from 'node-pg-migrate'

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable(COMPANIES_TABLES.AUDIT, {
    id: 'id',
    changing_user_id: {
        type: PgType.INT,
        references: {schema: TRUSTNET_SCHEMA, name:TRUSTNET_TABLES.USERS},
        onDelete: 'NO ACTION',
        notNull: false
        },
    changed_table: { type: PgType.VARCHAR, notNull: true},
    changed_id: { type: PgType.INT, notNull: true},
    activity: { type: PgType.VARCHAR, notNull: true},
    object_after_change: { type: PgType.JSON, notNull: true},
    created_at: { type: PgType.TIMESTAMP_WITHOUT_TIME_ZONE, default: pgm.func('current_timestamp') },
  })
  pgm.createTrigger(COMPANIES_TABLES.AUDIT, 'save_audit_update_time', {
    when: 'BEFORE',
    operation: 'UPDATE',
    level: 'ROW',
    function: 'update_timestamp'
  })
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTrigger(COMPANIES_TABLES.AUDIT, 'save_audit_update_time', { ifExists: true })
  pgm.dropTable(COMPANIES_TABLES.AUDIT, { ifExists: true })
}
