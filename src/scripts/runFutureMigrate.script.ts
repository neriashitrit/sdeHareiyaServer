import { TRUSTNET_TABLES, TRUSTNET_SCHEMA } from '../constants'
import { decryptPassword } from '../services/password.service'

import runMigrations from 'node-pg-migrate'
import DbConnection from '../db/dbConfig'

const run = async () => {
  const db = new DbConnection().getConnection()
  const schemasArray = await db.withSchema(TRUSTNET_SCHEMA).select('company_name','encoded_company_info').from(TRUSTNET_TABLES.COMPANY)
  let failedCounter = 0
  let succeededCounter = 0

  for (let index = 0; index < schemasArray.length; index++) {
    let schema = schemasArray[index].company_name
    if (schema == 'trustnet'){continue}
    
    try{
      await runMigrations({
      databaseUrl: (process.env.NODE_ENV === 'test' ? process.env.TEST_DATABASE_URL : process.env.DATABASE_URL) || '',
      dir: './src/db/migrations/company',
      direction: 'up',
      migrationsTable: 'schema_migrations',
      schema: schema,  
    })
      console.log(`${schema} migrations done`)
      succeededCounter++
      const userInfo = decryptPassword(schemasArray[index].encoded_company_info)
      const userInfoArray = userInfo.split(':')
      const DBuserName = userInfoArray[0]
      await db.raw(`GRANT ALL ON ALL TABLES IN SCHEMA ${schema} TO ${DBuserName};`)
      console.log(`${DBuserName} have all privileges on ${schema} schema tables`)
      await db.raw(`GRANT USAGE ON ALL SEQUENCES IN SCHEMA ${schema} TO ${DBuserName};`)
      console.log(`${DBuserName} have privileges to all ${schema} schema tables SEQUENCES`)
    }catch(error){
      console.error(`${schema} migrations failed with error: ${error}`)
      failedCounter++
    } 
  };
  
  console.log(`finish to run migrations, ${succeededCounter} migrations succeeded and ${failedCounter} migrations failed`)
}

run()
  .then(() => {
    console.log('Migrations finish to run !')
    process.exit(0)
  })
  .catch ((err: any) => {
    console.log(err)
    process.exit(1)
  })
