import { NextFunction, Response } from 'express'
import _ from 'lodash'

import DbService from '../services/db.service'
import { AuthInfo } from '../types';
import globalHelper from '../helpers/global.helper';
import DbConnection from '../db/dbConfig'
import CompanyModel from '../models/companies.model'
import { decryptPassword } from '../services/password.service'

export const getDBConnection = () =>
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const companyModel = new CompanyModel()
      const authInfo = req?.authInfo as AuthInfo
      const companyName = globalHelper.getSchemaName(authInfo)
      const company = await companyModel.getCompanyInfo(companyName)
      const companyInfo = getDecodedCompanyInfo(company.encoded_company_info)
      const connectionString = getConnectionString(companyInfo)
      const DataBaseService = new DbService()
      const db = new DbConnection().getConnection(connectionString) as any
      DataBaseService.setDb(db)
      res.locals.session = db
  
      return next()
    } catch (error) {
      console.error('in getDBConnection middleware', error);
      return
    }
}

  export const closeDBConnection = () =>
  async (req: any, res: Response) => {
    const authInfo = req?.authInfo as AuthInfo
    const companyName =  globalHelper.getSchemaName(authInfo)
    if (!res.locals.session.client.connectionSettings.user.includes(companyName)){
      console.error('security error database user access to wrong schema ');
      throw ('security error contact admin - database user error')
    }else{
      await res.locals.session.context.destroy()
      return res
    }
  }

  export const getConnectionString = ( userInfo: string) =>{
    //TODO change connectionString of prod when going up to prod
    const connectionString = process.env.NODE_ENV === 'test' 
    ?`postgres://${userInfo}@localhost:5432/trustnet` 
    :`postgres://${userInfo}@trustnet-dev-db.postgres.database.azure.com:5432/postgres?sslmode=require`
    return connectionString
}

export const getDecodedCompanyInfo = ( encodedCompanyInfo: string ): string =>{
  const decodedCompanyInfo = decryptPassword(encodedCompanyInfo)
  return decodedCompanyInfo
}
