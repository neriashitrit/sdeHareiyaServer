import { Request, Response } from 'express'

import { ITask } from 'types'
import TaskModel from '../models/tasks.model'
import tasksHelper from '../helpers/tasks.helper'
import { toInteger } from 'lodash'

const taskModel = new TaskModel()

export const upsertTask = async (req: Request, res: Response) => {
  console.log('in controller upsertTask');
  const  newTask: ITask  = req.body
  const schemaName = req.headers.company_name as string
  try {
    const taskId  = await taskModel.upsertTask(schemaName,newTask)
    return res.status(200).send({status:`task ${newTask.title} Received successfully`,taskId:taskId} )
  } catch (error) {
    console.error('ERROR in tasks.controller upsertTask()', error.message);
    return res.status(400).send({message:'Something went wrong', error:error.message})
  }
}

export const getTask = async (req: Request, res: Response) => {
  console.log('in controller getTask');
  const schemaName = req.headers.company_name as string
  const queryParams = req.body
  try {
    const task  = await tasksHelper.getTaskByIdOrExternalId(schemaName,queryParams)
    return res.status(200).send(task)
  } catch (error) {
    console.error('ERROR in tasks.controller getTask()', error.message);
    return res.status(400).send({message:'Something went wrong', error:error.message})
  }
}

export const getTasksByDaysRange = async (req: Request, res: Response) => {
  console.log('in controller getTasksByDaysRange');
  const schemaName = req.headers.company_name as string
  const sinceDaysAgo = req?.query?.sinceDaysAgo == 'All'? 'All': toInteger(req?.query?.sinceDaysAgo)
  const untilDaysAgo = toInteger(req?.query?.untilDaysAgo)

  try {
    const tasks  = await tasksHelper.getTasksByDaysRange(schemaName,sinceDaysAgo, untilDaysAgo)
    return res.status(200).send(tasks)
  } catch (error) {
    console.error('ERROR in tasks.controller getTask()', error);
    return res.status(400).send({message:'Something went wrong', error:error})
  }
}

