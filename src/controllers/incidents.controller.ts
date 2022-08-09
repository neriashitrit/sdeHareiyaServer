import { Request, Response } from 'express'

import { IIncident } from 'types'
import IncidentsModel from '../models/incidents.model'
import incidentsHelper from '../helpers/incidents.helper'

const incidentModel = new IncidentsModel()

export const upsertIncident = async (req: Request, res: Response) => {
  console.log('in controller upsertIncident');
  const  newIncident: IIncident  = req.body
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

export const getIncidentsByDaysRange = async  (req: Request, res: Response) => {
  console.log('in controller getIncidentsByDaysRange');
  const schemaName = req.headers.company_name as string
  const sinceDaysAgo = req?.body?.sinceDaysAgo||0
  const untilDaysAgo = req?.body?.untilDaysAgo||0
  try {
    const incidents  = await incidentsHelper.getIncidentsByDaysRange(schemaName,sinceDaysAgo, untilDaysAgo)
    return res.status(200).send(incidents)
  } catch (error:any) {
    console.error('ERROR in incidents.controller getIncident()', error);
    return res.status(400).send({message:'Something went wrong', error:error})
  }
}
