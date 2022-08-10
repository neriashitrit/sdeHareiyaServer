import DbService from '../services/db.service'
import { COMPANIES_TABLES } from '../constants'
import { INotification } from '../types'

export default class NotificationModel {
  db: DbService

  constructor() {
    this.db = new DbService()
  }

  getNotification = async (schemaName: string): Promise<INotification[]> =>{
      try{
        const notifications:INotification[] = await this.db.getMany(schemaName, COMPANIES_TABLES.NOTIFICATION, {}, 'created_at','desc')
        return notifications
      }
      catch (error){
      console.error(error);
      throw error
      }
  }
}
