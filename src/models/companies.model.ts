import DbService from '../services/db.service'
import { TRUSTNET_SCHEMA, TRUSTNET_TABLES } from '../constants'
import { ICompany } from '../types'


export default class CompanyModel {
  db: DbService

  constructor() {
    this.db = new DbService()
  }

  createCompany = async (schemaName: string, newCompany: ICompany): Promise<any> =>{
    const returnedId = await this.db.insertOne(schemaName,TRUSTNET_TABLES.COMPANY,newCompany)
    return returnedId
  }
  
  createCompanyTables = async (schemaName: string): Promise<any> =>{
    const returnedId = await this.db.creteNewCompanySchema(schemaName)
    return 
  }

  getCompany = async (company_name: string): Promise<any> =>{
    const company = await this.db.getOne(TRUSTNET_SCHEMA,TRUSTNET_TABLES.COMPANY,{company_name})
    return company
  }
}
