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
    const db = this.db.db
    const companyWithImage =  await db.withSchema(TRUSTNET_SCHEMA).select(`${TRUSTNET_TABLES.COMPANY}.id`,"company_name","sector","area_timestamp","active","renew_date","joining_date",`${TRUSTNET_TABLES.COMPANY}.created_at`,`${TRUSTNET_TABLES.COMPANY}.updated_at`,"image_id","url")
      .from(TRUSTNET_TABLES.COMPANY)
      .leftJoin(TRUSTNET_TABLES.IMAGE, { [`image.id`]: `${TRUSTNET_TABLES.COMPANY}.image_id` })
      .where(`${TRUSTNET_TABLES.COMPANY}.company_name`, company_name)
    return companyWithImage[0]
  }

  getCompanyUsersAndImage = async (company_name: string): Promise<any[]> =>{
    const db = this.db.db
    const imageWithUser = await db.withSchema(TRUSTNET_SCHEMA).select()
      .from(TRUSTNET_TABLES.COMPANY)
      .join(TRUSTNET_TABLES.USERS, { [`${TRUSTNET_TABLES.USERS}.company_id`]: `${TRUSTNET_TABLES.COMPANY}.id` })
      .join(TRUSTNET_TABLES.IMAGE, { [`image.id`]: `${TRUSTNET_TABLES.USERS}.image_id` })
      .where(`${TRUSTNET_TABLES.COMPANY}.company_name`, company_name)
    return imageWithUser
  }
  
  getAdminCompanies = async (email: string): Promise<any[]> =>{
    const db = this.db.db
    const AdminCompanies = await db.withSchema(TRUSTNET_SCHEMA).select(
      `${TRUSTNET_TABLES.USERS}.id`, `${TRUSTNET_TABLES.USERS}.email`, `${TRUSTNET_TABLES.COMPANY}.id as company_id`, `${TRUSTNET_TABLES.COMPANY}.company_name`)
    .from(TRUSTNET_TABLES.USERS)
    .join(TRUSTNET_TABLES.ADMIN_COMPANY, { [`${TRUSTNET_TABLES.ADMIN_COMPANY}.user_id`]: `${TRUSTNET_TABLES.USERS}.id` })
    .join(TRUSTNET_TABLES.COMPANY, { [`${TRUSTNET_TABLES.COMPANY}.id`]: `${TRUSTNET_TABLES.ADMIN_COMPANY}.company_id` })
    .where(`${TRUSTNET_TABLES.USERS}.email`, email)
    return AdminCompanies
  }

  getMonitoredDeviceNumber = async (schemaName: string): Promise<any> =>{
    const db = this.db.db
    const connectedMonitoredDeviceSum = await db.withSchema(schemaName).select().from(COMPANIES_TABLES.MONITORED_DEVICE).where({status:deviceStatus.CONNECTED}).sum('count').first()
    return connectedMonitoredDeviceSum
  }
  
  getAllMonitoredDevice = async (schemaName: string): Promise<any> =>{
    const AllMonitoredDevice = await this.db.getAll(schemaName, COMPANIES_TABLES.MONITORED_DEVICE)
    return AllMonitoredDevice
  }

  getSLA = async (schemaName: string): Promise<any> =>{
    const SLA = await this.db.getAll(schemaName, COMPANIES_TABLES.SLA)
    return SLA
  }

  getSourceIP = async (schemaName: string): Promise<any> =>{
    const SourceIP = await this.db.getAll(schemaName, COMPANIES_TABLES.SOURCE_IP)
    return SourceIP
  }

  getConfiguration = async (schemaName: string): Promise<any> =>{
    const company = await this.db.getOne(schemaName, COMPANIES_TABLES.CONFIGURATION)
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
