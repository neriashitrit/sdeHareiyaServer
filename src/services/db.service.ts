import { config } from 'dotenv'
import { Knex } from 'knex'
import runMigrations from 'node-pg-migrate'
import DbConnection from '../db/dbConfig'

export default class DbService {
  db!: Knex
  static instance: DbService

  constructor() {
    if (DbService.instance) {
      return DbService.instance
    }
    this.db = new DbConnection().getConnection()
    DbService.instance = this
  }

  getOneById = (schemaName: string, tableName: string, searchField:string, id: number): Promise<any> =>
    this.db.withSchema(schemaName).select().from(tableName).where(`${searchField}`, id).first()
  
  getOne = (schemaName: string, tableName: string, condition: Record<string, any> = {}): Promise<any> =>
    this.db.withSchema(schemaName).select().from(tableName).where(condition).first()

  getAll = (tableName: string, condition: Record<string, any> = {}): Promise<any> =>
    this.db.select().from(tableName).where(condition)

  getMany = (schemaName: string, tableName: string, condition: Record<string, any> = {}, columnName:string, order?:string): Promise<any> =>
    this.db.withSchema(schemaName).select().from(tableName).where(condition).orderBy(columnName, order)

  getManyByDate = (schemaName: string, tableName: string, condition: Record<string, any> = {}, columnName:string, from:string, to:string): Promise<any> =>
  this.db.withSchema(schemaName).select().from(tableName).whereBetween(columnName,[from,to]).andWhere(condition)

  insert = (schemaName: string, tableName: string, records: Record<string, string | number | boolean | any>[]): Promise<any> =>
    this.db.withSchema(schemaName).insert(records, ['*']).into(tableName)

  // TODO delete insertOne
  insertOne = (schemaName: string, tableName: string, record: Record<string, string | number | boolean|any>): Promise<any> =>
    this.insert(schemaName, tableName, [record]).then((result) => Promise.resolve(result?.[0]))

  update = (schemaName: string, tableName: string, updatedRecord: Record<string, any>, condition: Record<string, any> = {}): Promise<any> =>
    this.db.withSchema(schemaName).into(tableName).update(updatedRecord).where(condition).returning('*')

  delete = (tableName: string, condition: Record<string, any> = {}): Promise<any> =>
    this.db.delete().from(tableName).where(condition)

  upsertMerge = async (schemaName: string, tableName: string, updatedRecord: Record<string, any>, conflictField: string):Promise<string> =>{
    const returnedId = await this.db.withSchema(schemaName).into(tableName).insert(updatedRecord).onConflict(conflictField).merge().returning('id').then((returned)=>{return returned[0].id})
    return returnedId as string
  }

  creteNewCompanySchema = async (schemaName: string,):Promise<string> =>{
    const returnedId = await runMigrations({
      databaseUrl: (process.env.NODE_ENV === 'test' ? process.env.TEST_DATABASE_URL : process.env.DATABASE_URL) || '',
      dir: './dist/db/migrations/company',
      direction: 'up',
      migrationsTable: 'schema_migrations',
      schema:schemaName,
      createSchema: true,
    })
    console.log('Migrations done')
    console.log(returnedId)
    return "string"
  }
  
  // Read more on how to use: https://knexjs.org/#Raw
  sql = (query: string, params: any[] | Record<string, any>): Promise<any> => this.db.raw(query, params)
}
