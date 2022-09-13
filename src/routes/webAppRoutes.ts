import express from 'express'

import * as notificationController from '../controllers/notifications.controller'
import * as companiesController from '../controllers/companies.controller'
import * as usersController from '../controllers/users.controller'
import * as globalController from '../controllers/global.controller'
import * as tasksController from '../controllers/tasks.controller'
import * as incidentsController from '../controllers/incidents.controller'
import * as insightsController from '../controllers/insights.controller'

const router = express.Router()
// users
router.get('/user/login', usersController.userLogin)
router.get('/user/getAll', usersController.getAllCompanyUsers)
router.get('/user/getOne', usersController.getUser)

// notifications
router.get('/notifications/getRecent', notificationController.getRecentNotifications)
router.get('/notifications/getInterval', notificationController.getIntervalNotifications)

// companies
router.get('/company/getCompany', companiesController.getCompany)
router.get('/company/getMonitoredDeviceNumber', companiesController.getMonitoredDeviceNumber)
router.get('/company/getMonitoredDevice', companiesController.getAllMonitoredDevice)
router.get('/company/getSLA', companiesController.getSLA)
router.get('/company/getSourceIP', companiesController.getSourceIP)
router.post('/company/updateSourceIP', companiesController.updateSourceIP)

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

// global
router.post('/global/uploadAvatar', globalController.uploadAvatar)
router.get('/global/getAvatar', globalController.getAvatar)

export default router
