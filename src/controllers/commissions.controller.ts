import { Request, Response } from 'express'
import _ from 'lodash'

import { commissionModel } from '../models/index'
import { failureResponse, successResponse } from '../utils/db.utils'

export const getActiveCommissions = async (req: Request, res: Response) => {
  try {
    const commissions = await commissionModel.getCommissions({
      isActive: true
    })
    res.status(200).json(successResponse(commissions))
  } catch (error: any) {
    console.log(error)
    res.status(500).json(failureResponse(error))
  }
}
