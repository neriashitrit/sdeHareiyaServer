import { NextFunction, Request, Response } from 'express'

import { hashPassword, encryptPassword } from '../services/password.service'
import { AuthInfo, ICompany } from 'types'
import CompanyModel from '../models/companies.model'
import { TRUSTNET_SCHEMA } from '../constants'
import globalHelper from '../helpers/global.helper'

const companyModel = new CompanyModel()

export const createCompany =  async (req: Request, res: Response) => {
  console.log('in controller createCompanies');
  const newCompany: ICompany  = req?.body.company
  newCompany.api_key = hashPassword(newCompany.api_key)
  const DBuserName = req?.body?.database_user
  const DBuserEncodedPassword = await encryptPassword(req?.body?.database_password)
  newCompany.encoded_company_info = DBuserEncodedPassword
  try {
    // TODO run as transaction
    const companyId  = await companyModel.createCompany(TRUSTNET_SCHEMA,newCompany)
    await companyModel.createCompanyTables(newCompany.company_name, DBuserName, DBuserEncodedPassword)
    return res.status(200).send({status:`company ${newCompany.company_name} added successfully`,companyId:companyId} )
  } catch (error) {
    console.error('ERROR in companies.controller createCompany()', error.message);
    return res.status(400).send({message:'Something went wrong', error:error.message})
  }
}

export const getCompany =  async (req: Request, res: Response) => {
  try {
    console.log('in controller getCompanies');
  const authInfo:AuthInfo = req?.authInfo as AuthInfo
  const schemaName =  globalHelper.getSchemaName(authInfo)
  try {
    const company = await companyModel.getCompany(schemaName)
    return res.status(200).send(company)
  } catch (error) {
    console.error('ERROR in companies.controller getCompany()', error.message);
    return res.status(400).send({message:'Something went wrong', error:error.message})
  }
  } catch (error) {
   return 
  }
}

export const getAdminCompanies =  async (req: Request, res: Response) => {
  console.log('in controller getAdminCompanies');
  const authInfo:AuthInfo = req?.authInfo as AuthInfo
  const userMail = authInfo.emails[0]
  try {
    const AdminCompanies = await companyModel.getAdminCompanies(userMail)
    return res.status(200).send(AdminCompanies)
  } catch (error) {
    console.error('ERROR in companies.controller getAdminCompanies()', error.message);
    return res.status(400).send({message:'Something went wrong', error:error.message})
  }
}

export const getMonitoredDeviceNumber =  async (req: Request, res: Response, next: NextFunction) => {
  console.log('in controller getMonitoredDeviceNumber');
  const authInfo:AuthInfo = req?.authInfo as AuthInfo
  const schemaName =  globalHelper.getSchemaName(authInfo)
  try {
    const MonitoredDeviceNumber = await companyModel.getMonitoredDeviceNumber(schemaName)
    res.status(200).send(MonitoredDeviceNumber)
    return next()
  } catch (error) {
    console.error('ERROR in companies.controller getMonitoredDeviceNumber()', error.message);
    res.status(400).send({message:'Something went wrong', error:error.message})
    return next()
  }
}

export const getAllMonitoredDevice =  async (req: Request, res: Response, next: NextFunction) => {
  console.log('in controller getAllMonitoredDevice');
  const authInfo:AuthInfo = req?.authInfo as AuthInfo
  const schemaName =  globalHelper.getSchemaName(authInfo)
  try {
    const MonitoredDevice = await companyModel.getAllMonitoredDevice(schemaName)
    res.status(200).send(MonitoredDevice)
    return next()
  } catch (error) {
    console.error('ERROR in companies.controller getAllMonitoredDevice()', error.message);
    res.status(400).send({message:'Something went wrong', error:error.message})
    return next()
  }
}

export const getSLA =  async (req: Request, res: Response, next: NextFunction) => {
  console.log('in controller getSLA');
  const authInfo:AuthInfo = req?.authInfo as AuthInfo
  const schemaName =  globalHelper.getSchemaName(authInfo)
  try {
    const SLA = await companyModel.getSLA(schemaName)
    res.status(200).send(SLA)
    return next()
  } catch (error) {
    console.error('ERROR in companies.controller getSLA()', error.message);
    res.status(400).send({message:'Something went wrong', error:error.message})
    return next()
  }
}

export const getSourceIP =  async (req: Request, res: Response, next: NextFunction) => {
  console.log('in controller getSourceIP');
  const authInfo:AuthInfo = req?.authInfo as AuthInfo
  const schemaName =  globalHelper.getSchemaName(authInfo)
  try {
    const SourceIP = await companyModel.getSourceIP(schemaName)
    res.status(200).send(SourceIP)
    return next()
  } catch (error) {
    console.error('ERROR in companies.controller getSourceIP()', error.message);
    res.status(400).send({message:'Something went wrong', error:error.message})
    return next()
  }
}

export const updateSourceIP =  async (req: Request, res: Response, next: NextFunction) => {
  console.log('in controller updateSourceIP');
  const updatedSourceIP = req.body
  const authInfo:AuthInfo = req?.authInfo as AuthInfo
  const schemaName =  globalHelper.getSchemaName(authInfo)
  
  try {
    if (typeof(updatedSourceIP?.id) !== 'number'){throw {message:'send what is the id of the SourceIP you want to update'}}
    const SourceIP = await companyModel.updateSourceIP(schemaName,updatedSourceIP)
    res.status(200).send(SourceIP)
    return next()
  } catch (error) {
    console.error('ERROR in companies.controller updateSourceIP()', error.message);
    res.status(400).send({message:'Something went wrong', error:error.message})
    return next()
  }
}

export const updateConfiguration =  async (req: Request, res: Response, next: NextFunction) => {
  console.log('in controller updateConfiguration');
  const updatedConfiguration = req.body
  const authInfo:AuthInfo = req?.authInfo as AuthInfo
  const schemaName =  globalHelper.getSchemaName(authInfo)
  try {
    const status = await companyModel.updateConfiguration(schemaName,updatedConfiguration)
    res.status(200).send(status)
    return next()
  } catch (error) {
    console.error('ERROR in companies.controller updateConfiguration()', error.message);
    res.status(400).send({message:'Something went wrong', error:error.message})
    return next()
  }
}


export const getConfiguration =  async (req: Request, res: Response, next: NextFunction) => {
  console.log('in controller getConfiguration');
  const authInfo:AuthInfo = req?.authInfo as AuthInfo
  const schemaName =  globalHelper.getSchemaName(authInfo)
  try {
    const companyConfiguration = await companyModel.getConfiguration(schemaName)
    res.status(200).send(companyConfiguration)
    return next()
  } catch (error) {
    console.error('ERROR in companies.controller getConfiguration()', error.message);
    res.status(400).send({message:'Something went wrong', error:error.message})
    return next()
  }
}