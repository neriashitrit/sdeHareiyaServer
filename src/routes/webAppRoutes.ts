import express from 'express'

import * as notificationController from '../controllers/notifications.controller'
import * as companiesController from '../controllers/companies.controller'
import * as tasksController from '../controllers/tasks.controller'
import * as incidentsController from '../controllers/incidents.controller'
import * as insightsController from '../controllers/insights.controller'

const router = express.Router()

// notifications
router.get('/notifications/getRecent', notificationController.getRecentNotifications)

// companies
router.get('/company/getCompany', companiesController.getCompany)
router.get('/company/getMonitoredDeviceNumber', companiesController.getMonitoredDeviceNumber)
router.get('/company/getMonitoredDevice', companiesController.getAllMonitoredDevice)
router.get('/company/getSLA', companiesController.getSLA)

// incidents
router.get('/incident/getByDays', incidentsController.getIncidentsByDaysRange)

// tasks
router.get('/task/getByDays', tasksController.getTasksByDaysRange)
router.post('/task/update', tasksController.updateTask)

// insights
router.get('/insight/getByDays', insightsController.getInsightsByDaysRange)
router.post('/insight/update', insightsController.updateInsight)

// configurations
router.post('/configuration/updateConfiguration', companiesController.updateConfiguration)
router.get('/configuration/getConfiguration', companiesController.getConfiguration)

export default router
