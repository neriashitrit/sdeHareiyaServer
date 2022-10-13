import DbService from '../services/db.service'
import { COMPANIES_TABLES, notificationStatus } from '../constants'
import { IInsight } from '../types'
import notificationsHelper from '../helpers/notifications.helper'

export default class InsightsModel {
  db: DbService

  constructor() {
    this.db = new DbService()
  }

  upsertInsight = async ( schemaName: string, newInsight: IInsight): Promise<string> =>{
    try{
      const insightArray = await this.db.upsertMerge(schemaName,COMPANIES_TABLES.INSIGHT,newInsight,'id')
      const insight = insightArray[0]
      notificationsHelper.createNotification(schemaName,
        insight.title,
        insight.description,
        false,
        notificationStatus.NEW_INSIGHT,
        notificationStatus.NEW_INSIGHT)
      return insight?.id
    }
    catch (error){
    console.error(error);
    throw error
    }
  }
  
  updateInsight = async ( schemaName: string, newInsight: IInsight, id:number): Promise<IInsight> =>{
    try{
      const insight = await this.db.update(schemaName,COMPANIES_TABLES.INSIGHT,newInsight, {id})
      if (insight.length == 0){throw 'insight with same id do not exist'}
      return insight[0]
    }
    catch (error){
    console.error(error);
    throw error
    }
  }

  deleteInsight = async ( schemaName: string, id: number): Promise<IInsight> =>{
    try{
      const insight = await this.db.delete(schemaName,COMPANIES_TABLES.INSIGHT, {id})
      if (insight.length == 0){throw 'insight with same id do not exist'}
      return insight[0]
    }
    catch (error){
    console.error(error);
    throw error
    }
  }

  createInsight = async ( schemaName: string, newInsight: any): Promise<IInsight> =>{
    try{
      const insightArray = await this.db.insert(schemaName,COMPANIES_TABLES.INSIGHT, newInsight)
      const insight = insightArray[0]
      notificationsHelper.createNotification(schemaName,
        insight.title,
        insight.description,
        false,
        notificationStatus.NEW_INSIGHT,
        notificationStatus.NEW_INSIGHT)
      return insight
    }
    catch (error){
    console.error(error);
    throw error
    }
  }

  getInsight = async (schemaName: string, queryParams: any): Promise<IInsight> =>{
    const id = queryParams?.id
    if(!id){
      throw Error('you must provide id')
    }
    try{
      const insight:IInsight = await this.db.getOneById(schemaName, COMPANIES_TABLES.INSIGHT, 'id', id)
      return insight
    }
    catch (error){
    console.error(error);
    throw error
    }
  }
  getInsightsByDaysRange = async (schemaName: string, searchFiled: string, sinceDate: string, untilDate: string): Promise<IInsight[]> =>{
    try{
      //pay attention - the order of the select is important
      const insightsWithImage =  await this.db.db.withSchema(schemaName).select(`${COMPANIES_TABLES.IMAGE}.*`, `${COMPANIES_TABLES.INSIGHT}.*`)
      .from(COMPANIES_TABLES.INSIGHT)
      .leftJoin(COMPANIES_TABLES.IMAGE, { [`image.id`]: `${COMPANIES_TABLES.INSIGHT}.image_id` })
      .whereBetween(`${COMPANIES_TABLES.INSIGHT}.${searchFiled}`,[sinceDate,untilDate])
      return insightsWithImage
    }
    catch (error){
    console.error(error);
    throw error
    }
  }
}
