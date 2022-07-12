/* eslint-disable @typescript-eslint/naming-convention */
import { COMPANIES_TABLES, deviceStatus } from '../../constants'
import { MigrationBuilder, ColumnDefinitions, PgType } from 'node-pg-migrate'

export const shorthands: ColumnDefinitions | undefined = undefined

//TODO when finish with defining the db, create the schema by request with schema name

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createType('device_status_types', [deviceStatus.CONNECTED, deviceStatus.NOT_CONNECTED])
  pgm.createTable({ schema: 'spectory', name: COMPANIES_TABLES.MONITORED_DEVICE }, {
    id: 'id',
    status: { type: 'device_status_types' },
    title: { type: PgType.VARCHAR, notNull: true },
  })
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable({ schema: 'spectory', name: COMPANIES_TABLES.MONITORED_DEVICE }, { ifExists: true })
  pgm.dropType('device_status_types', { ifExists: true })

}
