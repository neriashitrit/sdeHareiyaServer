import DbService from '../services/db.service'
import { COMPANIES_TABLES, TRUSTNET_SCHEMA, TRUSTNET_TABLES, deviceStatus } from '../constants'
import { ICompany } from '../types'
import DbConnection from '../db/dbConfig'


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
  
  getMonitoredDeviceNumber = async (schemaName: string): Promise<any> =>{
    const db = new DbConnection().getConnection()
    const connectedMonitoredDeviceSum = await db.withSchema(schemaName).select().from(COMPANIES_TABLES.MONITORED_DEVICE).where({status:deviceStatus.CONNECTED}).sum('count').first()
    return connectedMonitoredDeviceSum
  }
}
