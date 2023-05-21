import { NextFunction, Response } from 'express'
import _ from 'lodash'

import { decryptPassword } from '../services/auth.service'

export const getDecodedInfo = (encodedCompanyInfo: string): string => {
  const decodedCompanyInfo = decryptPassword(encodedCompanyInfo)
  return decodedCompanyInfo
}
