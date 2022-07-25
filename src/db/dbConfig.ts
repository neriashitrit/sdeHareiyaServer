import dotenv from 'dotenv'
import knex from 'knex'

export default class DbConnection {
  connectionString: string

  constructor() {
    dotenv.config()
    this.connectionString =
      (process.env.NODE_ENV === 'test' ? process.env.TEST_DATABASE_URL : process.env.DATABASE_URL) || ''
  }

  getConnection = () =>
    knex({
      client: 'pg',
      connection: this.connectionString
    })
}
