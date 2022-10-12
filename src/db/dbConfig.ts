import dotenv from 'dotenv'
import knex from 'knex'

export default class DbConnection {
  connectionString: string

  constructor() {
    dotenv.config()
    this.connectionString =
      (process.env.NODE_ENV === 'test' ? process.env.TEST_DATABASE_URL : process.env.DATABASE_URL) || ''
  }

  getConnection = (newConnectionString?:string) =>
    knex({
      client: 'pg',
        connection: newConnectionString || this.connectionString,
        pool:newConnectionString? {min:1, max:1}: {min:2, max:10}
      })
}
