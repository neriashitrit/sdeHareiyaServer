import runMigrations from 'node-pg-migrate'

import DbConnection from '../db/dbConfig'
//TODO make it relevant to DB with schemas
const run = async () => {
  const db = new DbConnection().getConnection()
  await db.raw('DROP DATABASE IF EXISTS trustnet;')
  console.log('DATABASE dropped')
  await db.raw('DROP ROLE IF EXISTS trustnetuser;')
  console.log('ROLE dropped')
  await db.raw('CREATE DATABASE trustnet;')
  console.log('DATABASE created')
  await db.raw('CREATE ROLE trustnetuser WITH PASSWORD trustnetpass;') //may need  - 'trustnetpass'
  console.log('ROLE created')
  await db.raw('ALTER DATABASE trustnet OWNER TO trustnetuser;')
  console.log(' trustnetuser is DATABASE trustnet OWNER')
  await db.raw('ALTER ROLE trustnetuser WITH LOGIN;')
  console.log(' trustnetuser WITH LOGIN')

  console.log('Creation Done')
}

run()
  .then(() => {
    console.log('DB created successfully!')
    process.exit(0)
  })
  .catch((err: any) => {
    console.log(err)
    process.exit(1)
  })
