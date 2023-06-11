/* eslint-disable @typescript-eslint/naming-convention */
import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate'

import { Tables } from '../../constants'

export const shorthands: ColumnDefinitions | undefined = undefined

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.alterColumn(Tables.COMPANY_DETAILS, 'incorporation_date', {
    notNull: false
  })
  pgm.alterColumn(Tables.COMPANY_DETAILS, 'incorporation_country', {
    notNull: false
  })
  pgm.alterColumn(Tables.COMPANY_DETAILS, 'funds_source', {
    notNull: false
  })
  pgm.alterColumn(Tables.COMPANY_DETAILS, 'contacts', {
    notNull: false
  })
  pgm.alterColumn(Tables.COMPANY_DETAILS, 'active_years', {
    notNull: false
  })
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.alterColumn(Tables.COMPANY_DETAILS, 'incorporation_date', {
    notNull: false
  })
  pgm.alterColumn(Tables.COMPANY_DETAILS, 'incorporation_country', {
    notNull: false
  })
  pgm.alterColumn(Tables.COMPANY_DETAILS, 'incorporation_date', {
    notNull: false
  })
  pgm.alterColumn(Tables.COMPANY_DETAILS, 'funds_source', {
    notNull: false
  })
  pgm.alterColumn(Tables.COMPANY_DETAILS, 'contacts', {
    notNull: false
  })
  pgm.alterColumn(Tables.COMPANY_DETAILS, 'active_years', {
    notNull: false
  })
}
