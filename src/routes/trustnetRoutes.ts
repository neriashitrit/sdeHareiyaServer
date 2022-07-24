import express from 'express'

import * as companiesController from '../controllers/companies.controller'

const router = express.Router()

// companies
router.post('/company/create',companiesController.createCompany)

export default router
