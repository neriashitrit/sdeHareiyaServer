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

// incidents
router.get('/incident/getByDays', incidentsController.getIncidentsByDaysRange)

// tasks
router.get('/task/getByDays', tasksController.getTasksByDaysRange)

// insights
router.get('/insight/getByDays', insightsController.getInsightsByDaysRange)
router.post('/insight/update', insightsController.updateInsight)

export default router
