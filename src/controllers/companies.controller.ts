import { Request, Response } from 'express'

import { encryptPassword } from '../services/password.service'
import { ICompany } from 'types'
import CompanyModel from '../models/companies.model'

const companyModel = new CompanyModel()



export const createCompany =  async (req: Request, res: Response) => {
    console.log('in controller createCompanies');
    const newCompany: ICompany  = req.body
    newCompany.api_key = encryptPassword(newCompany.api_key)
    try {
      // TODO run as transaction
      const companyId  = await companyModel.createCompany('public',newCompany)
      await companyModel.createCompanyTables(newCompany.company_name)
      return res.status(200).send({status:`company ${newCompany.company_name} added successfully`,companyId:companyId} )
    } catch (error) {
      console.error('ERROR in companies.controller createCompany()', error.message);
      return res.status(400).send({message:'Something went wrong', error:error.message})
    }}
