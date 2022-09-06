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
    const user = await this.db.getOne(TRUSTNET_SCHEMA,TRUSTNET_TABLES.USERS,{email})
    return user
  }

  createUser = async (newUser: any): Promise<IUser> =>{
    const user = await this.db.insert(TRUSTNET_SCHEMA,TRUSTNET_TABLES.USERS, newUser)
    return user
  }
}
