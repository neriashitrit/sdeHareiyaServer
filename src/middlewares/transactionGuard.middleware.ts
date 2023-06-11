import { NextFunction, Request, Response } from 'express'

import { Tables } from '../constants'
import { transactionSideModel } from '../models'

export const transactionGuard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.locals.user!
    const { transactionId } = req.body

    const transactionSides = await transactionSideModel.getTransactionSides({
      [`${Tables.TRANSACTION_SIDES}.transaction_id`]: transactionId
    })

    if (transactionSides.findIndex((transactionSide) => transactionSide.user.id === user.id) === -1) {
      return res.status(401).send({ success: false, message: 'not authorized transaction' })
    }

    return next()
  } catch (error) {
    return res.status(400).send({ success: false, message: 'error in transaction guard', error: error.message })
  }
}
