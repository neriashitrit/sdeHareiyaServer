import { Knex } from 'knex'

import DbConnection from '../db/dbConfig'

export default class DbService {
  static instance: DbService
  knex!: Knex

  constructor() {
    if (DbService.instance) {
      return DbService.instance
    }
    this.knex = new DbConnection().getConnection()
    DbService.instance = this
  }

  static getInstance = () => DbService.instance || new DbService()

  getOneById = (tableName: string, id: number) => this.knex.select().from(tableName).where({ id }).first()

  getOne = (tableName: string, condition: Record<string, any> | string) =>
    this.knex.select().from(tableName).where(condition)?.first()

  getAll = (tableName: string, condition: Record<string, any> | string) =>
    this.knex.select().from(tableName).where(condition)

  insert = (tableName: string, records: Record<string, any> | Record<string, any>[]) =>
    this.knex.insert(records, ['*']).into(tableName)

  insertOne = (tableName: string, record: Record<string, any>) => this.insert(tableName, [record])

  update = (tableName: string, updatedRecord: Record<string, any>, condition: Record<string, any> | string) =>
    this.knex(tableName).update(updatedRecord).where(condition).returning('*')

  updateOneById = (tableName: string, updatedRecord: Record<string, any>, id: number) =>
    this.update(tableName, updatedRecord, { id })

  delete = (tableName: string, condition: Record<string, any> = {}) =>
    this.knex.delete().from(tableName).where(condition)

  deleteAll = (tableName: string) => this.knex.delete().from(tableName)

  upsertMerge = (tableName: string, updatedRecord: Record<string, any>, conflictField: string) =>
    this.knex(tableName).insert(updatedRecord).onConflict(conflictField).merge()

  runAsTransaction = async (func: (trx: Knex.Transaction) => Promise<any>) => {
    const trx = await this.knex.transaction()
    try {
      const response = await func(trx)
      trx.commit()
      return response
    } catch (error) {
      trx.rollback()
      throw error
    }
  }

  // Read more on how to use: https://knexjs.org/#Raw
  sql = (query: string, params: any[] | Record<string, any>) => this.knex.raw(query, params)
}
