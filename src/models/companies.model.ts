import DbService from '../services/db.service'
import { COMPANIES_TABLES, TRUSTNET_SCHEMA, TRUSTNET_TABLES, deviceStatus } from '../constants'
import { ICompany } from '../types'
import DbConnection from '../db/dbConfig'

import _ from 'lodash'

export default class CompanyModel {
  db: DbService

  constructor() {
    this.db = new DbService()
  }

  createCompany = async (schemaName: string, newCompany: ICompany): Promise<any> =>{
    const returnedId = await this.db.insertOne(schemaName,TRUSTNET_TABLES.COMPANY,newCompany)
    return returnedId
  }
  
  createCompanyTables = async (schemaName: string) =>{
    await this.db.creteNewCompanySchema(schemaName)
  }

  getCompany = async (company_name: string): Promise<ICompany> =>{
    const company = await this.db.getOne(TRUSTNET_SCHEMA,TRUSTNET_TABLES.COMPANY,{company_name})
    return company
  }
  
  getMonitoredDeviceNumber = async (schemaName: string): Promise<any> =>{
    const db = new DbConnection().getConnection()
    const connectedMonitoredDeviceSum = await db.withSchema(schemaName).select().from(COMPANIES_TABLES.MONITORED_DEVICE).where({status:deviceStatus.CONNECTED}).sum('count').first()
    return connectedMonitoredDeviceSum
  }
  
  getAllMonitoredDevice = async (schemaName: string): Promise<any> =>{
    const AllMonitoredDevice = await this.db.getAll(schemaName,COMPANIES_TABLES.MONITORED_DEVICE)
    return AllMonitoredDevice
  }

  getSLA = async (schemaName: string): Promise<any> =>{
    const SLA = await this.db.getAll(schemaName,COMPANIES_TABLES.SLA)
    return SLA
  }

  getSourceIP = async (schemaName: string): Promise<any> =>{
    const SourceIP = await this.db.getAll(schemaName,COMPANIES_TABLES.SOURCE_IP)
    return SourceIP
  }

  getConfiguration = async (schemaName: string): Promise<any> =>{
    const company = await this.db.getOne(schemaName,COMPANIES_TABLES.CONFIGURATION)
    return company
  }

  updateConfiguration = async (schemaName: string, newConfiguration: any): Promise<any> =>{
    const updatedConfiguration  = await this.db.update(schemaName, COMPANIES_TABLES.CONFIGURATION, newConfiguration)
    if (_.isEmpty(updatedConfiguration)){
      await this.db.insert(schemaName, COMPANIES_TABLES.CONFIGURATION, newConfiguration)
    }
    return 'company configuration updated'
  }

  updateSourceIP = async (schemaName: string, newSourceIP: any): Promise<any> =>{
    const updatedSourceIP  = await this.db.update(schemaName, COMPANIES_TABLES.SOURCE_IP, newSourceIP, {id:newSourceIP.id})
    if (_.isEmpty(updatedSourceIP)) {throw {message:'there is no sourceIP with this id'}}
    return updatedSourceIP
  }
}
