import DbService from '../services/db.service'

const run = async () => {
  const dbService = new DbService();
}

run()
  .then(() => {
    console.log('run seed successfully')
    process.exit(0)
  })
  .catch ((err: any) => {
    console.log(err)
    process.exit(1)
  })
