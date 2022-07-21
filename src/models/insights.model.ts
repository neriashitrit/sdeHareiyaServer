import DbService from '../services/db.service'
import { COMPANIES_TABLES } from '../constants'
import { IInsight } from '../types'

export default class InsightsModel {
  db: DbService

  constructor() {
    this.db = new DbService()
  }

  upsertInsight = async ( 
    schemaName: string,
    newInsight: IInsight,
): Promise<string> =>{
      try{
        const returnedId = await this.db.upsertMerge(schemaName,COMPANIES_TABLES.INSIGHT,newInsight,'id')
        return returnedId
      }
      catch(error){
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
      catch(error){
      console.error(error);
      throw error
      }
    }
  }
