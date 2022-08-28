import DbService from '../services/db.service'
import { COMPANIES_TABLES } from '../constants'
import { IInsight } from '../types'

export default class InsightsModel {
  db: DbService

  constructor() {
    this.db = new DbService()
  }

  upsertInsight = async ( schemaName: string, newInsight: IInsight): Promise<string> =>{
    try{
      const insight = await this.db.upsertMerge(schemaName,COMPANIES_TABLES.INSIGHT,newInsight,'id')
      return insight[0]?.id
    }
    catch (error){
    console.error(error);
    throw error
    }
  }
  
  updateInsight = async ( schemaName: string, newInsight: IInsight): Promise<IInsight> =>{
    try{
      const insight = await this.db.update(schemaName,COMPANIES_TABLES.INSIGHT,newInsight, {id:newInsight.id})
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
      const insight = await this.db.insert(schemaName,COMPANIES_TABLES.INSIGHT, newInsight)
      if (insight.length == 0){throw 'insight with same id do not exist'}
      return insight[0]
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
      const insights:IInsight[] = await this.db.getManyByDate(schemaName,COMPANIES_TABLES.INSIGHT,{},searchFiled,sinceDate, untilDate)
      return insights
    }
    catch (error){
    console.error(error);
    throw error
    }
  }
}
