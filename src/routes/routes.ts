import express from 'express'

import * as tasksController from '../controllers/tasks.controller'
import * as incidentsController from '../controllers/incidents.controller'
import * as insightsController from '../controllers/insights.controller'
import { apiSenderAuth, adminSenderAuth } from '../middlewares/auth.middleware'

const router = express.Router()

// users
// router.post('/users/invite', userController.createUser)


const healthCheck = async (req: express.Request, res:  express.Response) => {
    return res.status(200).send("I am alive!!!")
}

router.get('/healthCheck',healthCheck)

// tasks
router.post('/task/upsert', apiSenderAuth, tasksController.upsertTask)
router.get('/task/get', apiSenderAuth, tasksController.getTask)


// incidents
router.post('/incident/upsert', apiSenderAuth, incidentsController.upsertIncident)
router.get('/incident/get', apiSenderAuth, incidentsController.getIncident)


// insights
router.post('/insight/upsert', apiSenderAuth, insightsController.upsertInsight)
router.get('/insight/get', apiSenderAuth, insightsController.getInsight)

export default router
