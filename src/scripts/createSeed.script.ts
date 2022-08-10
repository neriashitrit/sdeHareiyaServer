import CompanyModel from '../models/companies.model';
import { TRUSTNET_SCHEMA, TRUSTNET_TABLES } from '../constants'
import DbService from '../services/db.service'
import { encryptPassword } from '../services/password.service'

const run = async () => {
  const dbService = new DbService();
  await dbService.insertOne(TRUSTNET_SCHEMA, TRUSTNET_TABLES.COMPANY, 
    {company_name: 'trustnet', api_key: encryptPassword('1234qwer@')})
  await dbService.insertOne(TRUSTNET_SCHEMA, TRUSTNET_TABLES.COMPANY, 
    {company_name: 'spectory', api_key: encryptPassword('1234qwer@')})
  const companyModel = new CompanyModel()
  await companyModel.createCompanyTables('spectory')
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
