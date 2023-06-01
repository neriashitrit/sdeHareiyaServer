/* eslint-disable @typescript-eslint/naming-convention */
import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate'

export const shorthands: ColumnDefinitions | undefined = undefined

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createFunction(
    'update_timestamp',
    [],
    { returns: 'TRIGGER', language: 'plpgsql', replace: true },
    `BEGIN
    NEW.updated_at = now();
    RETURN NEW;
  END;`
  )
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropFunction('update_timestamp', [], { ifExists: true })
}
