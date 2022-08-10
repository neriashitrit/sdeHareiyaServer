import runMigrations from 'node-pg-migrate'
// postgres://trustnet_admin:password@localhost:5432/trustnet?sslmode=require
import DbConnection from '../db/dbConfig'
//TODO make it relevant to DB with schemas
const run = async () => {
  const db = new DbConnection().getConnection()
  await db.raw('DROP DATABASE IF EXISTS trustnet;')
  console.log('DATABASE dropped')
  await db.raw('DROP ROLE IF EXISTS trustnet_admin;')
  console.log('ROLE dropped')
  await db.raw('CREATE DATABASE trustnet;')
  console.log('DATABASE created')
  await db.raw('CREATE ROLE trustnet_admin WITH PASSWORD \'password\';')
  console.log('ROLE created')
  await db.raw('ALTER DATABASE trustnet OWNER TO trustnet_admin;') // error here - check_is_member_of_role
  console.log(' trustnet_admin is DATABASE trustnet OWNER')
  await db.raw('ALTER ROLE trustnet_admin WITH LOGIN;')
  console.log(' trustnet_admin WITH LOGIN')

  console.log('Creation Done')
}

run()
  .then(() => {
    console.log('DB created successfully!')
    process.exit(0)
  })
  .catch ((err: any) => {
    console.log(err)
    process.exit(1)
  })
