import express from 'express'

import * as notificationController from '../controllers/notifications.controller'
import * as companiesController from '../controllers/companies.controller'
import * as usersController from '../controllers/users.controller'
import * as tasksController from '../controllers/tasks.controller'
import * as incidentsController from '../controllers/incidents.controller'
import * as insightsController from '../controllers/insights.controller'

const router = express.Router()
// users
router.get('/user/login', usersController.userLogin)

// notifications
router.get('/notifications/getRecent', notificationController.getRecentNotifications)

// companies
router.get('/company/getCompany', companiesController.getCompany)
router.get('/company/getMonitoredDeviceNumber', companiesController.getMonitoredDeviceNumber)
router.get('/company/getMonitoredDevice', companiesController.getAllMonitoredDevice)
router.get('/company/getSLA', companiesController.getSLA)

// incidents
router.get('/incident/getByDays', incidentsController.getIncidentsByDaysRange)
router.post('/incident/update', incidentsController.updateIncident)

// tasks
router.get('/task/getByDays', tasksController.getTasksByDaysRange)
router.post('/task/update', tasksController.updateTask)

// insights
router.get('/insight/getByDays', insightsController.getInsightsByDaysRange)
router.post('/insight/update', insightsController.updateInsight)
router.post('/insight/delete', insightsController.deleteInsight)
router.post('/insight/create', insightsController.createInsight)

// configurations
router.post('/configuration/updateConfiguration', companiesController.updateConfiguration)
router.get('/configuration/getConfiguration', companiesController.getConfiguration)

export default router
