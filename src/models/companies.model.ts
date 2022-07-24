import DbService from '../services/db.service'
import { TRUSTNET_TABLES } from '../constants'
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

//   getByUsername = (username: string): Promise<IUser> => this.db.getOne(TRUSTNET_TABLES.COMPANY, { username })

//   getById = (id: number): Promise<IUser> => this.db.updateOneById(TRUSTNET_TABLES.COMPANY, id)

//   update = (id: number, user: Partial<IUser>): Promise<any> => this.db.updateOneById(TRUSTNET_TABLES.USERS, user, id)
}
