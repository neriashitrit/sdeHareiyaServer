import { Request, Response } from 'express'

import { ICompany } from 'types'
import CompanyModel from '../models/companies.model'

const companyModel = new CompanyModel()



export const createCompany =  async (req: Request, res: Response) => {
    console.log('in controller createTennants');
    const newCompany: ICompany  = req.body
    try {
      const companyId  = await companyModel.createCompany('public',newCompany)
      console.log(newCompany.company_name)
      const companyMigrate  = await companyModel.createCompanyTables(newCompany.company_name)
      //TODO add with transaction migrate up, create DBuser
      return res.status(200).send({status:`company ${newCompany.company_name} added successfully`,companyId:companyId} )
    } catch (error) {
      console.error('ERROR in companies.controller createCompany()', error.message);
      return res.status(400).send({message:'Something went wrong', error:error.message})
    }}
