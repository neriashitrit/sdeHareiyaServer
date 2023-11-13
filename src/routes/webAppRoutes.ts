import express from 'express'

import * as usersController from '../controllers/users.controller'

const router = express.Router()

///////////////////////////
//         Users         //
///////////////////////////
router.get('/getUser', usersController.getUser)
router.put('/updateUser', usersController.updateUser)

export default router
