import DbService from '../services/db.service'
import { COMPANIES_TABLES } from '../constants'
import { IIncident } from '../types'

export default class IncidentsModel {
  db: DbService

  constructor() {
    this.db = new DbService()
  }

  upsertIncident = async (schemaName: string, newIncident: IIncident): Promise<string> =>{
      try{
        const returnedId = await this.db.upsertMerge(schemaName,COMPANIES_TABLES.INCIDENT,newIncident,'external_id')//might be external_id
        return returnedId
      }
      catch(error){
      console.error(error);
      throw error
      }
    }
  
    getIncident = async (schemaName: string, searchField: string, id: number): Promise<IIncident> =>{
        try{
          const incident:IIncident = await this.db.getOneById(schemaName,COMPANIES_TABLES.INCIDENT, searchField, id)
          return incident
        }
        catch(error){
        console.error(error);
        throw error
        }
    }
}
