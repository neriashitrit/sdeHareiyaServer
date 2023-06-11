import { ICompanyDetails } from 'safe-shore-common'

import { Tables } from '../constants'
import DbService from '../services/db.service'

const db = new DbService()

export const companyDetailsModel = {
  createCompanyDetails: async (newCompanyDetails: Record<string, any>): Promise<ICompanyDetails[]> => {
    try {
      const companyDetails = await db.insert(Tables.COMPANY_DETAILS, newCompanyDetails)
      return companyDetails
    } catch (error) {
      console.error('ERROR in companyDetails.modal createCompanyDetails()', error.message)
      throw {
        message: `error while trying to createCompanyDetails. error: ${error.message}`
      }
    }
  }
}
