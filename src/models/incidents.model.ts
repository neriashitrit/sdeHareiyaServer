import DbService from '../services/db.service'
import { COMPANIES_TABLES, notificationStatus, TRUSTNET_SCHEMA, TRUSTNET_TABLES } from '../constants'
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
        this.db.updateAudit(schemaName, COMPANIES_TABLES.INCIDENT, incident?.id, isOld ? 'updated' : 'created', incident, null)
      return incident?.id
    }
    catch (error){
    console.error(error);
    throw error
    }
  }
  
  getIncident = async (schemaName: string, searchField: string, id: number): Promise<IIncident> =>{
    try{
      const incident:IIncident = await this.db.trustnetDb.withSchema(schemaName).select().from(COMPANIES_TABLES.INCIDENT).where(searchField, id).first()
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
  
  updateIncident = async ( schemaName: string, newIncident: IIncident, email:string): Promise<IIncident> =>{
    try{
      const incidentArray = await this.db.update(schemaName, COMPANIES_TABLES.INCIDENT, newIncident, {id:newIncident.id})
      if (incidentArray.length == 0){throw 'incident with same id do not exist'}
      const incident = incidentArray[0]
      const user = await this.db.getOne(TRUSTNET_SCHEMA, TRUSTNET_TABLES.USERS, {email})
      this.db.updateAudit(schemaName, COMPANIES_TABLES.INCIDENT, incident?.id, 'updated', incident, user?.id)
      return incident
    }
    catch (error){
    console.error(error);
    throw error
    }
  }
}
