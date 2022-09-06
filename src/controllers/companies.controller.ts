import { Request, Response } from 'express'

import { encryptPassword } from '../services/password.service'
import { AuthInfo, ICompany } from 'types'
import CompanyModel from '../models/companies.model'
import { TRUSTNET_SCHEMA } from '../constants'
import globalHelper from '../helpers/global.helper'

const companyModel = new CompanyModel()

export const createCompany =  async (req: Request, res: Response) => {
  console.log('in controller createCompanies');
  const newCompany: ICompany  = req?.body
  newCompany.api_key = encryptPassword(newCompany.api_key)
  try {
    // TODO run as transaction
    const companyId  = await companyModel.createCompany(TRUSTNET_SCHEMA,newCompany)
    await companyModel.createCompanyTables(newCompany.company_name)
    return res.status(200).send({status:`company ${newCompany.company_name} added successfully`,companyId:companyId} )
  } catch (error) {
    console.error('ERROR in companies.controller createCompany()', error.message);
    return res.status(400).send({message:'Something went wrong', error:error.message})
  }
}

export const getCompany =  async (req: Request, res: Response) => {
  console.log('in controller getCompanies');
  const companyName = req?.headers?.company_name as string
  try {
    const company = await companyModel.getCompany(companyName)
    return res.status(200).send(company)
  } catch (error) {
    console.error('ERROR in companies.controller getCompany()', error.message);
    return res.status(400).send({message:'Something went wrong', error:error.message})
  }
}

export const getMonitoredDeviceNumber =  async (req: Request, res: Response) => {
  console.log('in controller getMonitoredDeviceNumber');
  const authInfo:AuthInfo = req?.authInfo as AuthInfo
  const schemaName =  globalHelper.getSchemaName(authInfo)
  try {
    const MonitoredDeviceNumber = await companyModel.getMonitoredDeviceNumber(schemaName)
    return res.status(200).send(MonitoredDeviceNumber)
  } catch (error) {
    console.error('ERROR in companies.controller getMonitoredDeviceNumber()', error.message);
    return res.status(400).send({message:'Something went wrong', error:error.message})
  }
}

export const getAllMonitoredDevice =  async (req: Request, res: Response) => {
  console.log('in controller getAllMonitoredDevice');
  const companyName = req?.headers?.company_name as string
  try {
    const MonitoredDevice = await companyModel.getAllMonitoredDevice(companyName)
    return res.status(200).send(MonitoredDevice)
  } catch (error) {
    console.error('ERROR in companies.controller getAllMonitoredDevice()', error.message);
    return res.status(400).send({message:'Something went wrong', error:error.message})
  }
}

export const getSLA =  async (req: Request, res: Response) => {
  console.log('in controller getSLA');
  const authInfo:AuthInfo = req?.authInfo as AuthInfo
  const schemaName =  globalHelper.getSchemaName(authInfo)
  try {
    const SLA = await companyModel.getSLA(schemaName)
    return res.status(200).send(SLA)
  } catch (error) {
    console.error('ERROR in companies.controller getSLA()', error.message);
    return res.status(400).send({message:'Something went wrong', error:error.message})
  }
}

export const updateConfiguration =  async (req: Request, res: Response) => {
  console.log('in controller updateConfiguration');
  const updatedConfiguration = req.body
  const companyName = req?.headers?.company_name as string
  try {
    const status = await companyModel.updateConfiguration(companyName,updatedConfiguration)
    return res.status(200).send(status)
  } catch (error) {
    console.error('ERROR in companies.controller updateConfiguration()', error.message);
    return res.status(400).send({message:'Something went wrong', error:error.message})
  }
}


export const getConfiguration =  async (req: Request, res: Response) => {
  console.log('in controller getConfiguration');
  const authInfo:AuthInfo = req?.authInfo as AuthInfo
  const schemaName =  globalHelper.getSchemaName(authInfo)
  try {
    const companyConfiguration = await companyModel.getConfiguration(schemaName)
    return res.status(200).send(companyConfiguration)
  } catch (error) {
    console.error('ERROR in companies.controller getConfiguration()', error.message);
    return res.status(400).send({message:'Something went wrong', error:error.message})
  }
}