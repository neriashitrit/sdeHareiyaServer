import { NextFunction, Request, Response } from 'express'
import { toInteger } from 'lodash'

import { AuthInfo, IIncident } from 'types'
import IncidentsModel from '../models/incidents.model'
import incidentsHelper from '../helpers/incidents.helper'
import globalHelper from '../helpers/global.helper'

const incidentModel = new IncidentsModel()

export const upsertIncident = async (req: Request, res: Response) => {
  console.log('in controller upsertIncident');
  const  newIncident: IIncident = req.body
  const schemaName = req.headers.company_name as string
  try {
    const incidentId  = await incidentModel.upsertIncident(schemaName,newIncident)
    return res.status(200).send({status:`incident ${newIncident.title} Received successfully`, incidentId: incidentId})
  } catch (error:any) {
    console.error('ERROR in incidents.controller upsertIncident()', error.message);
    return res.status(400).send({message:'Something went wrong', error:error.message})
  }
}

export const getIncident = async  (req: Request, res: Response) => {
  console.log('in controller getIncident');
  const schemaName = req.headers.company_name as string
  const queryParams = req.body
  try {
    const incident  = await incidentsHelper.getIncidentByIdOrExternalId(schemaName,queryParams)
    return res.status(200).send(incident)
  } catch (error:any) {
    console.error('ERROR in incidents.controller getIncident()', error.message);
    return res.status(400).send({message:'Something went wrong', error:error.message})
  }
}

export const getIncidentsByDaysRange = async  (req: Request, res: Response, next: NextFunction) => {
  console.log('in controller getIncidentsByDaysRange');
  const authInfo:AuthInfo = req?.authInfo as AuthInfo
  const schemaName = globalHelper.getSchemaName(authInfo)
  const sinceDaysAgo = req?.query?.sinceDaysAgo == 'All'? 'All': toInteger(req?.query?.sinceDaysAgo)
  const untilDaysAgo = toInteger(req?.query?.untilDaysAgo)       

  try {
    const incidents  = await incidentsHelper.getIncidentsByDaysRange(schemaName,sinceDaysAgo, untilDaysAgo)
    res.status(200).send(incidents)
    return next()
  } catch (error:any) {
    console.error('ERROR in incidents.controller getIncident()', error);
    res.status(400).send({message:'Something went wrong', error:error})
    return next()
  }
}

export const updateIncident = async (req: Request, res: Response, next: NextFunction) => {
  const updatedIncident: IIncident = req.body
  const authInfo:AuthInfo = req?.authInfo as AuthInfo
  const schemaName = globalHelper.getSchemaName(authInfo)
  try {
    const Incident = await incidentModel.updateIncident(schemaName,updatedIncident)
    res.status(200).send({status:`incident updated successfully`,incident: Incident})
    return next()
  } catch (error) {
    console.error('ERROR in incidents.controller updateIncident()', error);
    res.status(400).send({message:'Something went wrong', error: error})
    return next()
  }
}