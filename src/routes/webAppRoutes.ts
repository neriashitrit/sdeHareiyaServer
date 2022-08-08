import express from 'express'

import * as notificationController from '../controllers/notifications.controller'
import * as companiesController from '../controllers/companies.controller'

const router = express.Router()

// notifications
router.get('/notifications/getRecent', notificationController.getRecentNotifications)

// companies
router.get('/company/get',companiesController.getCompany)

export default router
