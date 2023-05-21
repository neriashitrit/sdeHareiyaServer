import DbConnection from '../db/dbConfig'

//TODO make it relevant to DB with schemas
const run = async () => {
  const db = new DbConnection().getConnection()
  await db.raw('DROP DATABASE IF EXISTS safeShore;')
  console.log('DATABASE dropped')
  await db.raw('DROP ROLE IF EXISTS safeShore_admin;')
  console.log('ROLE dropped')
  await db.raw('CREATE DATABASE safeShore;')
  console.log('DATABASE created')
  await db.raw("CREATE ROLE safeShore_admin WITH PASSWORD 'password';")
  console.log('ROLE created')
  await db.raw('ALTER DATABASE safeShore OWNER TO safeShore_admin;')
  console.log(' safeShore_admin is DATABASE safeShore OWNER')
  await db.raw('ALTER ROLE safeShore_admin WITH LOGIN;')
  console.log(' safeShore_admin WITH LOGIN')

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
