import runMigrations from 'node-pg-migrate'

import DbConnection from '../db/dbConfig'
//TODO make it relevant to DB with schemas
const run = async () => {
  const db = new DbConnection().getConnection()
  await db.raw('DROP SCHEMA IF EXISTS public CASCADE;')
  console.log('Schema dropped')
  await db.raw('CREATE SCHEMA public;')
  console.log('Schema created')
  await db.raw('GRANT ALL ON SCHEMA public TO ??', [process.env.DATABASE_USER || 'username'])
  console.log('Permissions to schema granted to', process.env.DATABASE_USER || 'username')
  await runMigrations({
    databaseUrl: (process.env.NODE_ENV === 'test' ? process.env.TEST_DATABASE_URL : process.env.DATABASE_URL) || '',
    dir: './src/db/migrations',
    direction: 'up',
    migrationsTable: 'schema_migrations'
  })
  console.log('Migrations done')
}

run()
  .then(() => {
    console.log('DB reset successfully!')
    process.exit(0)
  })
  .catch ((err: any) => {
    console.log(err)
    process.exit(1)
  })
