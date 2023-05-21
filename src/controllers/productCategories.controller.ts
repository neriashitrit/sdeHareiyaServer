import { Request, Response } from 'express'
import _ from 'lodash'

import { Tables } from '../constants'
import { productCategoryModel } from '../models/index'
import { failureResponse, successResponse } from '../utils/db.utils'

export const getActiveProductCategories = async (req: Request, res: Response) => {
  try {
    const productCategories = await productCategoryModel.getProductCategories({
      [`${Tables.PRODUCT_CATEGORIES}.isActive`]: true
    })
    return res.status(200).json(successResponse(productCategories))
  } catch (error: any) {
    console.log(error)
    return res.status(500).json(failureResponse(error))
  }
}
