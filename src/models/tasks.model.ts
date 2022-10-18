import DbService from '../services/db.service'
import { COMPANIES_TABLES, notificationStatus, TRUSTNET_SCHEMA, TRUSTNET_TABLES } from '../constants'
import { ITask } from '../types'
import notificationsHelper from '../helpers/notifications.helper'

export default class TaskModel {
  db: DbService

  constructor() {
    this.db = new DbService()
  }

  upsertTask = async (schemaName: string, newTask: ITask): Promise<string> =>{
      try{
        const taskArray = await this.db.upsertMerge(schemaName,COMPANIES_TABLES.TASK,newTask,'id')
        const task = taskArray[0]
        const isOld =  task.created_at < task.updated_at
        notificationsHelper.createNotification(schemaName,
        task.title,
        task.description,
        isOld,
        notificationStatus.TASK_CHANGED,
        notificationStatus.NEW_TASK)
        this.db.updateAudit(schemaName, COMPANIES_TABLES.TASK, task?.id, isOld ? 'updated' : 'created', task, null)
        return task?.id
      }
      catch (error){
      console.error(error);
      throw error
      }
  }

  getTask = async (schemaName: string, searchField:string, id: number): Promise<ITask> =>{
      try{
        const task:ITask = await this.db.getOneById(schemaName, COMPANIES_TABLES.TASK, searchField, id)
        return task
      }
      catch (error){
      console.error(error);
      throw error
      }
  }

  getTasksByDaysRange = async (schemaName: string, searchFiled: string, sinceDate: string, untilDate: string): Promise<ITask[]> =>{
    try{
      const tasks:ITask[] = await this.db.getManyByDate(schemaName, COMPANIES_TABLES.TASK, {}, searchFiled, sinceDate, untilDate)
      return tasks
    }
    catch (error){
    console.error(error);
    throw error
    }
  }
  
  updateTask = async ( schemaName: string, newTask: ITask, email:string): Promise<ITask> =>{
    try{
      const taskArray = await this.db.update(schemaName, COMPANIES_TABLES.TASK, newTask, {id:newTask.id})
      if (taskArray.length == 0){throw 'task with same id do not exist'}
      const task = taskArray[0]
      const user = await this.db.getOne(TRUSTNET_SCHEMA, TRUSTNET_TABLES.USERS, {email})
      this.db.updateAudit(schemaName, COMPANIES_TABLES.TASK, task?.id, 'updated', task, user?.id)
      return task
    }
    catch (error){
    console.error(error);
    throw error
    }
  }
}
