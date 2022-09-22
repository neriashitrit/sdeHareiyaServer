/* eslint-disable @typescript-eslint/naming-convention */
import { COMPANIES_TABLES, taskStatus, taskPriority } from '../../../constants'
import { MigrationBuilder, PgType } from 'node-pg-migrate'

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createType('task_status_types', 
        [taskStatus.OPEN, taskStatus.IN_PROGRESS, taskStatus.CLOSE])
    pgm.createType('task_priority_types', 
        [taskPriority.HIGH, taskPriority.MEDIUM, taskPriority.LOW])
    pgm.createTable(COMPANIES_TABLES.TASK, {
        id: 'id',
        external_id: { type: PgType.INT },
        title: { type: PgType.VARCHAR, notNull: true },
        description: { type: PgType.VARCHAR },
        status: { type: 'task_status_types' },
        priority: { type: 'task_priority_types' },
        owner: { type: PgType.VARCHAR },
        last_updating_user: { type: PgType.VARCHAR },
        is_visible: { type: PgType.BOOLEAN, default: true, notNull: true },
        incident_id: {
            type: PgType.INT,
            references: COMPANIES_TABLES.INCIDENT,
            onDelete: 'CASCADE',
            notNull: true
        },
        created_at: { type: PgType.TIMESTAMP_WITHOUT_TIME_ZONE, default: pgm.func('current_timestamp') },
        updated_at: { type: PgType.TIMESTAMP_WITHOUT_TIME_ZONE, default: pgm.func('current_timestamp') },
    })
    pgm.createTrigger(COMPANIES_TABLES.TASK, 'save_task_update_time', {
        when: 'BEFORE',
        operation: 'UPDATE',
        level: 'ROW',
        function: 'update_timestamp'
    })    
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropTrigger(COMPANIES_TABLES.TASK, 'save_task_update_time', { ifExists: true })
    pgm.dropTable(COMPANIES_TABLES.TASK, { ifExists: true })
    pgm.dropType('task_status_types', { ifExists: true })
    pgm.dropType('task_priority_types', { ifExists: true })
}
