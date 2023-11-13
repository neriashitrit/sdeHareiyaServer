import dotenv from 'dotenv'
import knex from 'knex'

export default class DbConnection {
  connectionString: string

  constructor() {
    dotenv.config()
    this.connectionString = process.env.DATABASE_URL || ''
  }

  getConnection = () =>
    knex({
      // client: 'pg',
      connection: this.connectionString,
      pool: { min: 2, max: 10 },
      migrations: {
        directory: __dirname + '/db/migrations'
      },
    })
}
