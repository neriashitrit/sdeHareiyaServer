/* eslint-disable @typescript-eslint/naming-convention */
import { COMPANIES_TABLES, insightStatus, insightUserPreference } from '../../../constants'
import { MigrationBuilder, ColumnDefinitions, PgType } from 'node-pg-migrate'

export const shorthands: ColumnDefinitions | undefined = undefined

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createType('insight_status_types', 
        [insightStatus.NEW_RECOMMENDATION, insightStatus.WAITING_FOR_WORK, 
            insightStatus.AT_WORK, insightStatus.FINISHED])
    pgm.createType('insight_user_preference_types', 
        [insightUserPreference.RECOMMENDED_FOR_YOU, insightUserPreference.INTERESTED, 
            insightUserPreference.WE_GOT_ONE, insightUserPreference.MAYBE_LATER])
    pgm.createTable(COMPANIES_TABLES.INSIGHT, {
        id: 'id',
        title: { type: PgType.VARCHAR, notNull: true },
        status: { type: 'insight_status_types', default: insightStatus.NEW_RECOMMENDATION },
        user_preference: { type: 'insight_user_preference_types', default: insightUserPreference.RECOMMENDED_FOR_YOU },
        priority: { type: PgType.VARCHAR },
        summary: { type: PgType.VARCHAR },
        description: { type: PgType.VARCHAR },
        is_relevant: { type: PgType.BOOLEAN, default: true, notNull: true },
        due_date: { type: PgType.TIMESTAMP_WITHOUT_TIME_ZONE },
        created_at: { type: PgType.TIMESTAMP_WITHOUT_TIME_ZONE, default: pgm.func('current_timestamp') },
        updated_at: { type: PgType.TIMESTAMP_WITHOUT_TIME_ZONE, default: pgm.func('current_timestamp') },
    })
    pgm.createTrigger(COMPANIES_TABLES.INSIGHT, 'save_insight_update_time', {
        when: 'BEFORE',
        operation: 'UPDATE',
        level: 'ROW',
        function: 'update_timestamp'
    })    
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropTrigger(COMPANIES_TABLES.INSIGHT, 'save_insight_update_time', { ifExists: true })
    pgm.dropTable(COMPANIES_TABLES.INSIGHT, { ifExists: true })
    pgm.dropType('insight_status_types', { ifExists: true })
    pgm.dropType('insight_user_preference_types', { ifExists: true })
}
