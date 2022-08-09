import DbService from '../services/db.service'
import { COMPANIES_TABLES } from '../constants'
import { ITask } from '../types'

export default class TaskModel {
  db: DbService

  constructor() {
    this.db = new DbService()
  }

  upsertTask = async (schemaName: string, newTask: ITask): Promise<string> =>{
      try{
        const returnedId = await this.db.upsertMerge(schemaName,COMPANIES_TABLES.TASK,newTask,'id')
        return returnedId
      }
      catch(error){
      console.error(error);
      throw error
      }
  }

  getTask = async (schemaName: string, searchField:string, id: number): Promise<ITask> =>{
      try{
        const task:ITask = await this.db.getOneById(schemaName, COMPANIES_TABLES.TASK, searchField, id)
        return task
      }
      catch(error){
      console.error(error);
      throw error
      }
  }
  getTasksByDaysRange = async (schemaName: string, searchFiled: string, sinceDate: string, untilDate: string): Promise<ITask[]> =>{
    try{
      const tasks:ITask[] = await this.db.getManyByDate(schemaName,COMPANIES_TABLES.TASK,{},searchFiled,sinceDate, untilDate)
      return tasks
    }
    catch(error){
    console.error(error);
    throw error
    }
  }
}
