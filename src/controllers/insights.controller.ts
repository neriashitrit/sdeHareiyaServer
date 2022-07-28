import { Request, Response } from 'express'

import { IInsight } from 'types'
import InsightsModel from '../models/insights.model'

const insightModel = new InsightsModel()

export const upsertInsight = async (req: Request, res: Response) => {
  const  newInsight: IInsight  = req.body
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