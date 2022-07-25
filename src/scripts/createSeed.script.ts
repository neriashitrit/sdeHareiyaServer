import { TRUSTNET_TABLES } from '../constants'
import DbService from '../services/db.service'
import { encryptPassword } from '../services/password.service'

const run = async () => {
  const dbService = new DbService();
  await dbService.insertOne('public', TRUSTNET_TABLES.COMPANY, 
    {company_name: 'trustnet', api_key: encryptPassword('1234qwer@')})
}

run()
  .then(() => {
    console.log('run seed successfully')
    process.exit(0)
  })
  .catch((err: any) => {
    console.log(err)
    process.exit(1)
  })
