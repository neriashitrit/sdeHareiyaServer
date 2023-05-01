import dotenv from 'dotenv';
import knex from 'knex';
import { knexSnakeCaseMappers } from 'objection';

export default class DbConnection {
  connectionString: string;

  constructor() {
    dotenv.config();
    this.connectionString =
      (process.env.NODE_ENV === 'dev'
        ? process.env.TEST_DATABASE_URL
        : process.env.DATABASE_URL) || '';
  }

  getConnection = () =>
    knex({
      client: 'pg',
      connection: this.connectionString,
      pool: { min: 2, max: 10 },
      migrations: {
        directory: __dirname + '/db/migrations',
      },
      seeds:
        process.env.NODE_ENV === 'dev'
          ? {
              directory: __dirname + '/db/seeds',
            }
          : undefined,
      ...knexSnakeCaseMappers(),
    });
}
