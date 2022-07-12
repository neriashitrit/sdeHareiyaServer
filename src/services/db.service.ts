import { Knex } from 'knex'
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

  getOneById = (tableName: string, id: number): Promise<any> => this.db.select().from(tableName).where({ id }).first()

  getOne = (tableName: string, condition: Record<string, any> = {}): Promise<any> =>
    this.db.select().from(tableName).where(condition).first()

  getAll = (tableName: string, condition: Record<string, any> = {}): Promise<any> =>
    this.db.select().from(tableName).where(condition)

  insert = (tableName: string, records: Record<string, string | number>[]): Promise<any> =>
    this.db.insert(records, ['*']).into(tableName)

  insertOne = (tableName: string, record: Record<string, string | number>): Promise<any> =>
    this.insert(tableName, [record]).then((result) => Promise.resolve(result?.[0]))

  update = (tableName: string, updatedRecord: Record<string, any>, condition: Record<string, any> = {}): Promise<any> =>
    this.db(tableName).update(updatedRecord).where(condition).returning('*')

  updateOneById = async (tableName: string, updatedRecord: Record<string, any>, id: number): Promise<any> =>
    (await this.update(tableName, updatedRecord, { id }))?.[0]

  delete = (tableName: string, condition: Record<string, any> = {}): Promise<any> =>
    this.db.delete().from(tableName).where(condition)

  deleteAll = (tableName: string): Promise<any> => this.db.delete().from(tableName)

  // Read more on how to use: https://knexjs.org/#Raw
  sql = (query: string, params: any[] | Record<string, any>): Promise<any> => this.db.raw(query, params)
}
