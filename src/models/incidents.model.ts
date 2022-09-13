import DbService from '../services/db.service'
import { COMPANIES_TABLES, notificationStatus } from '../constants'
import { IIncident } from '../types'
import notificationsHelper from '../helpers/notifications.helper'
export default class IncidentsModel {
  db: DbService

  constructor() {
    this.db = new DbService()
  }

  upsertIncident = async (schemaName: string, newIncident: IIncident): Promise<string> =>{
    try{
      const incidentArray = await this.db.upsertMerge(schemaName,COMPANIES_TABLES.INCIDENT,newIncident,'external_id')
      const incident = incidentArray[0]
      const isOld =  incident.created_at < incident.updated_at
      notificationsHelper.createNotification(schemaName,
        incident.title,
        incident.description,
        isOld,
        notificationStatus.INCIDENT_CHANGED,
        notificationStatus.NEW_INCIDENT)
      return incident?.id
    }
    catch (error){
    console.error(error);
    throw error
    }
  }
  
  getIncident = async (schemaName: string, searchField: string, id: number): Promise<IIncident> =>{
    try{
      const incident:IIncident = await this.db.getOneById(schemaName,COMPANIES_TABLES.INCIDENT, searchField, id)
      return incident
    }
    catch (error){
    console.error(error);
    throw error
    }
  }
  getIncidentsByDaysRange = async (schemaName: string, searchFiled: string, sinceDate: string, untilDate: string): Promise<IIncident[]> =>{
    try{
      const incidents:IIncident[] = await this.db.getManyByDate(schemaName,COMPANIES_TABLES.INCIDENT,{},searchFiled,sinceDate, untilDate)
      return incidents
    }
    catch (error){
    console.error(error);
    throw error
    }
  }
  
  updateIncident = async ( schemaName: string, newIncident: IIncident): Promise<IIncident> =>{
    try{
      const incident = await this.db.update(schemaName, COMPANIES_TABLES.INCIDENT, newIncident, {id:newIncident.id})
      if (incident.length == 0){throw 'incident with same id do not exist'}
      return incident[0]
    }
    catch (error){
    console.error(error);
    throw error
    }
  }
}
