import express from 'express';
import DbService from '../services/db.service';
import * as commissionsController from '../controllers/commissions.controller';
import * as globalController from '../controllers/global.controller';

const router = express.Router();

///////////////////////////
//     Health Check      //
///////////////////////////
router.get('/healthCheck', globalController.healthCheck);

///////////////////////////
//      Commissions      //
///////////////////////////
router.get('/getCommissions', commissionsController.getActiveCommissions);

export default router;
