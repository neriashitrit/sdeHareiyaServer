import { Request, Response } from 'express'
import { toInteger } from 'lodash'

import { AuthInfo, IInsight } from 'types'
import InsightsModel from '../models/insights.model'
import insightsHelper from '../helpers/insights.helper'
import globalHelper from '../helpers/global.helper'
import * as globalController from './global.controller'
import  FileService  from '../services/storage.service'

const insightModel = new InsightsModel()
const fileService = FileService.getInstance()

export const upsertInsight = async (req: Request, res: Response) => {
  const  newInsight: IInsight = req.body
  const schemaName = req.headers.company_name as string
  try {
    const insightId = await insightModel.upsertInsight(schemaName,newInsight)
    return res.status(200).send({status:`insight ${newInsight.title} Received successfully`,insightId: insightId})
  } catch (error) {
    console.error('ERROR in insights.controller upsertInsight()', error.message);
    return res.status(400).send({message:'Something went wrong', error: error.message})
  }
}

export const getInsight = async (req: Request, res: Response) => {
  const schemaName = req.headers.company_name as string
  const queryParams = req.body
  try {
    const insight  = await insightModel.getInsight(schemaName,queryParams)
    return res.status(200).send(insight)
  } catch (error) {
    console.error('ERROR in insights.controller getInsight()', error.message);
    return res.status(400).send({message:'Something went wrong', error:error})
  }
}

export const getInsightsByDaysRange = async  (req: Request, res: Response) => {
  console.log('in controller getInsightsByDaysRange');
  const authInfo:AuthInfo = req?.authInfo as AuthInfo
  const schemaName = globalHelper.getSchemaName(authInfo)
  const sinceDaysAgo = req?.query?.sinceDaysAgo == 'All'? 'All': toInteger(req?.query?.sinceDaysAgo)
  const untilDaysAgo = toInteger(req?.query?.untilDaysAgo)

  try {
    const insights  = await insightsHelper.getInsightsByDaysRange(schemaName,sinceDaysAgo, untilDaysAgo)
    return res.status(200).send(insights)
  } catch (error:any) {
    console.error('ERROR in insights.controller getInsight()', error);
    return res.status(400).send({message:'Something went wrong', error:error})
  }
}

export const updateInsight = async (req: Request, res: Response) => {
  const updatedInsight: IInsight = req.body
  const authInfo:AuthInfo = req?.authInfo as AuthInfo
  const schemaName = globalHelper.getSchemaName(authInfo)
  try {
    const insight = await insightModel.updateInsight(schemaName,updatedInsight)
    return res.status(200).send({status:`insight updated Received successfully`,insight: insight})
  } catch (error) {
    console.error('ERROR in insights.controller updateInsight()', error);
    return res.status(400).send({message:'Something went wrong', error: error})
  }
}

export const deleteInsight = async (req: Request, res: Response) => {
  const insightID = req.body?.id
  const authInfo:AuthInfo = req?.authInfo as AuthInfo
  const schemaName = globalHelper.getSchemaName(authInfo)
  try {
    const insight = await insightModel.deleteInsight(schemaName, insightID)
    return res.status(200).send({status:`insight deleted successfully`,insight: insight})
  } catch (error) {
    console.error('ERROR in insights.controller deleteInsight()', error);
    return res.status(400).send({message:'Something went wrong', error: error})
  }
}

export const createInsight = async (req: Request, res: Response) => {
  const newInsight = {title:req.body.title, description:req.body.description, priority:req.body.priority}
  const authInfo:AuthInfo = req?.authInfo as AuthInfo
  const {avatarType, randomCode}= req.body
  const {files}:any  = req
  const {avatarImage} = files
  const schemaName = globalHelper.getSchemaName(authInfo)
  try {
    const insight = await insightModel.createInsight(schemaName,newInsight)
    const ImageUrl = await fileService.insert(avatarImage, randomCode, avatarType)
    const newImage = await globalHelper.createImage(avatarType, randomCode, authInfo, insight.id, ImageUrl)
    return res.status(200).send({status:`new insight Received successfully`,insight: insight})
  } catch (error) {
    console.error('ERROR in insights.controller createInsight()', error);
    return res.status(400).send({message:'Something went wrong', error: error})
  }
}