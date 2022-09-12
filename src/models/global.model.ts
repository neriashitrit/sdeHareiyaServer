import DbService from '../services/db.service'

import _ from 'lodash'

export default class UserModel {
  db: DbService

  constructor() {
    this.db = new DbService()
  }

  
}
