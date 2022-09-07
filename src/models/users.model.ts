import DbService from '../services/db.service'
import { TRUSTNET_SCHEMA, TRUSTNET_TABLES } from '../constants'

import _ from 'lodash'
import { IUser } from 'types'

export default class UserModel {
  db: DbService

  constructor() {
    this.db = new DbService()
  }

  getUser = async (email: string): Promise<any> =>{
    const last_login = new Date()
    const user = await this.db.update(TRUSTNET_SCHEMA,TRUSTNET_TABLES.USERS,{last_login},{email})
    return user?.[0]
  }

  createUser = async (newUser: any): Promise<IUser> =>{
    const user = await this.db.insert(TRUSTNET_SCHEMA,TRUSTNET_TABLES.USERS, newUser)
    return user
  }

  getAllCompanyUsers  = async (company_id: number): Promise<IUser[]> =>{
    const users = await this.db.getAll(TRUSTNET_SCHEMA,TRUSTNET_TABLES.USERS, {company_id})
    console.log(users)
    return users
  }
}
