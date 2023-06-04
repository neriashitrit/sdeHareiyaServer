import express from 'express'

import * as commissionsController from '../controllers/commissions.controller'
import * as globalController from '../controllers/global.controller'
import * as productCategoriesController from '../controllers/productCategories.controller'

const router = express.Router()

///////////////////////////
//     Health Check      //
///////////////////////////
router.get('/healthCheck', globalController.healthCheck)

///////////////////////////
//      Commissions      //
///////////////////////////
router.get('/getCommissions', commissionsController.getActiveCommissions)

///////////////////////////
//   Product Categories  //
///////////////////////////
router.get('/productCategories', productCategoriesController.getActiveProductCategories)

///////////////////////////
//       Contact Us      //
///////////////////////////
router.post('/sendContactUs', globalController.sendContactUs)

export default router
