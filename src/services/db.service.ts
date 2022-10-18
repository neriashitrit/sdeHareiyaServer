import { COMPANIES_TABLES, TRUSTNET_SCHEMA } from '../constants'
import { Knex } from 'knex'
import runMigrations from 'node-pg-migrate'
import DbConnection from '../db/dbConfig'

export default class DbService {
  db!: Knex
  trustnetDb!: Knex
  static instance: DbService

  constructor() {
    if (DbService.instance) {
      return DbService.instance
    }
    this.db = new DbConnection().getConnection()
    this.trustnetDb = new DbConnection().getConnection()
    DbService.instance = this
  }

  setDb (db: Knex<any, any[]>){
    this.db = db
  }

  getOneById = (schemaName: string, tableName: string, searchField:string, id: number): Promise<any> =>{
    const db = schemaName === TRUSTNET_SCHEMA ? this.trustnetDb : this.db
    return db.withSchema(schemaName).select().from(tableName).where(`${searchField}`, id).first()
  }
  
  getOne = (schemaName: string, tableName: string, condition: Record<string, any> = {}): Promise<any> =>{
    const db = schemaName === TRUSTNET_SCHEMA ? this.trustnetDb : this.db
    return db.withSchema(schemaName).select().from(tableName).where(condition).first()
  }

  getAll = (schemaName: string, tableName: string, condition: Record<string, any> = {}): Promise<any> =>{
    const db = schemaName === TRUSTNET_SCHEMA ? this.trustnetDb : this.db
    return db.withSchema(schemaName).select().from(tableName).where(condition)
  }
  getMany = (schemaName: string, tableName: string, condition: Record<string, any> = {}, columnName:string, order?:string): Promise<any> =>{
    const db = schemaName === TRUSTNET_SCHEMA ? this.trustnetDb : this.db
    return db.withSchema(schemaName).select().from(tableName).where(condition).orderBy(columnName, order)
  }
  getManyByDate = (schemaName: string, tableName: string, condition: Record<string, any> = {}, columnName:string, from:string, to:string): Promise<any> =>{
    const db = schemaName === TRUSTNET_SCHEMA ? this.trustnetDb : this.db
    return db.withSchema(schemaName).select().from(tableName).whereBetween(columnName,[from,to]).andWhere(condition)
  }
  insert = (schemaName: string, tableName: string, records: Record<string, string | number | boolean | any>[]): Promise<any> =>{
    const db = schemaName === TRUSTNET_SCHEMA ? this.trustnetDb : this.db
    return db.withSchema(schemaName).insert(records, ['*']).into(tableName)
  }
  // TODO delete insertOne
  insertOne = (schemaName: string, tableName: string, record: Record<string, string | number | boolean|any>): Promise<any> =>
    this.insert(schemaName, tableName, [record]).then((result) => Promise.resolve(result?.[0]))

  update = (schemaName: string, tableName: string, updatedRecord: Record<string, any>, condition: Record<string, any> = {}): Promise<any> =>    {
    const db = schemaName === TRUSTNET_SCHEMA ? this.trustnetDb : this.db
    return db.withSchema(schemaName).into(tableName).update(updatedRecord).where(condition).returning('*')
  }
  delete = (schemaName: string, tableName: string, condition: Record<string, any> = {}): Promise<any> =>{
    const db = schemaName === TRUSTNET_SCHEMA ? this.trustnetDb : this.db
    return db.withSchema(schemaName).delete().from(tableName).where(condition).returning('*')
  }

  upsertMerge = async (schemaName: string, tableName: string, updatedRecord: Record<string, any>, conflictField: string):Promise<any> =>{
    const returnedId = await this.trustnetDb.withSchema(schemaName).into(tableName).insert(updatedRecord).onConflict(conflictField).merge().returning('*')
    return returnedId
  }

  updateAudit = async (schemaName: string, changed_table:string, changed_id:number, activity:string, object_after_change:JSON, changing_user_id:number|null):Promise<any> =>{
    const auditObject = {changed_table, changed_id, activity, object_after_change, changing_user_id}
    const returnedId = await this.db.withSchema(schemaName).into(COMPANIES_TABLES.AUDIT).insert(auditObject)
    return returnedId
  }

  creteNewCompanySchema = async (schemaName: string) =>{
    const migrations = await runMigrations({
      databaseUrl: (process.env.NODE_ENV === 'test' ? process.env.TEST_DATABASE_URL : process.env.DATABASE_URL) || '',
      dir: './dist/db/migrations/company',
      direction: 'up',
      migrationsTable: 'schema_migrations',
      schema:schemaName,
      createSchema: true,
    })
    console.log(`${schemaName} schema created`)
    console.log(migrations)
  }
  
  createDatabaseUser  = async (schemaName: string, DBuserName: string, userEncodedPassword: string) =>{
    console.log('in createDatabaseUser');
    const db = this.trustnetDb
    await db.raw(`CREATE ROLE ${DBuserName} WITH PASSWORD \'${userEncodedPassword}'\;`)
    console.log(`role ${DBuserName} crated`)
    await db.raw(`ALTER ROLE ${DBuserName} WITH LOGIN;`)
    console.log(`${DBuserName} WITH LOGIN`)
    await db.raw(`ALTER SCHEMA ${schemaName} OWNER TO ${DBuserName};`)
    console.log(`${DBuserName} is ${schemaName} schema OWNER`)
    await db.raw(`GRANT ALL ON SCHEMA ${schemaName} to ${DBuserName};`)
    console.log(`${DBuserName} have all privileges on ${schemaName} schema`)
    await db.raw(`GRANT ALL ON ALL TABLES IN SCHEMA ${schemaName} TO ${DBuserName};`)
    console.log(`${DBuserName} have all privileges on ${schemaName} schema tables`)
    await db.raw(`GRANT USAGE ON ALL SEQUENCES IN SCHEMA ${schemaName} TO ${DBuserName};`)
    console.log(`${DBuserName} have privileges to all ${schemaName} schema tables SEQUENCES`)
  }
}
