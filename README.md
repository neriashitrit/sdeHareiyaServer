## Development
### Local Setup

Nodejs: 16.15.0
Postgres: v14.3

Run `yarn install` to install the dependencies.

### Dotenv

Create a `.env` file in the project root directory: `touch .env`.

Fill the new file with the following:
```
DATABASE_URL="postgres://username:password@localhost:5432/iottemplate"
```
(DATABASE_URL=postgres://{db_username}:{db_password}@{host}:{port}/{db_name})


### DB Setup

To create a development DB for the first time:

```
DROP DATABASE IF EXISTS ubtech;
DROP ROLE IF EXISTS ubuser;
CREATE DATABASE ubtech;
CREATE ROLE username WITH PASSWORD 'ubpass';
ALTER DATABASE ubtech OWNER TO ubuser;
ALTER ROLE ubuser WITH LOGIN;
```