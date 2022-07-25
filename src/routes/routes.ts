import express from 'express'

import * as tasksController from '../controllers/tasks.controller'
import * as incidentsController from '../controllers/incidents.controller'
import * as insightsController from '../controllers/insights.controller'
import { adminSenderAuth } from '../middlewares/auth.middleware'

const router = express.Router()

// users
// router.post('/users/invite', userController.createUser)


const healthCheck = async (req: express.Request, res:  express.Response) => {
    return res.status(200).send("I am alive!!!")
}

router.get('/healthCheck',healthCheck)

// tasks
router.post('/task/upsert', tasksController.upsertTask)
router.get('/task/get', tasksController.getTask)


// incidents
router.post('/incident/upsert', incidentsController.upsertIncident)
router.get('/incident/get', incidentsController.getIncident)


// insights
router.post('/insight/upsert', insightsController.upsertInsight)
router.get('/insight/get', insightsController.getInsight)

export default router
