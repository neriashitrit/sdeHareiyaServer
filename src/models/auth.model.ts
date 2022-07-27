import DbService from '../services/db.service'
import { TRUSTNET_TABLES } from '../constants'


export default class AuthModel {
  db: DbService

  constructor() {
    this.db = new DbService()
  }

  getHashedPassword = async (schemaName: string, company_name: string): Promise<string> =>{
    console.log('in getHashedPassword');
    const company = await this.db.getOne(schemaName,TRUSTNET_TABLES.COMPANY,{company_name})
    return company.api_key
  }
  
}
