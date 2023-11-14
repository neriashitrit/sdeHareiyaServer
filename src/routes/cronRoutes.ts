import express from 'express'

import * as globalController from '../controllers/global.controller'

const router = express.Router()

///////////////////////////
//     Health Check      //
///////////////////////////
router.get('/healthCheck', globalController.healthCheck)


export default router
