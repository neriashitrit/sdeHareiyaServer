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
      client: 'mssql',
      connection: {
        server: 'sde-h-database-server.database.windows.net',
        user: 'SdeHareiyaDB',
        password: 'ahn4lH8TM7FZrAxF0OB7MNz_SSxt_brV',
        database: 'sde-h-free-db',
        requestTimeout: 60000, // 60 seconds timeout
        port:1433,
        options: {
          encrypt: true, // Use encryption
          enableArithAbort: true, // Required for Azure
      }
      },
      // pool: { min: 2, max: 10 },
      // migrations: {
      //   directory: __dirname + '/db/migrations'
      // },
    })
}
