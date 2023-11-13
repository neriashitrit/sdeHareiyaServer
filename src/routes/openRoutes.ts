import express from 'express'

import * as globalController from '../controllers/global.controller'

const router = express.Router()

///////////////////////////
//     Health Check      //
///////////////////////////
router.get('/healthCheck', globalController.healthCheck)

///////////////////////////
//       Contact Us      //
///////////////////////////
router.post('/sendContactUs', globalController.sendContactUs)

export default router
