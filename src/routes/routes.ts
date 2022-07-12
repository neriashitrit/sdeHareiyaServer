import express from 'express'

import * as overviewController from '../controllers/overview.controller'

const router = express.Router()

// users
// router.post('/users/invite', userController.createUser)

// tennants
// router.get('/tennants', tennantController.getTennants)
router.get('/neria',()=> {console.log('in neria');
})


// overview
router.get('/overview/:id', overviewController.getOverviewTotalSubsData)

export default router
