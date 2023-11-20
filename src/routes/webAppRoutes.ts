import express from 'express'

import * as usersController from '../controllers/users.controller'

const router = express.Router()

///////////////////////////
//         Users         //
///////////////////////////
router.get('/getUser', usersController.getUser)
router.post('/createUser', usersController.createUser)
router.put('/updateUser', usersController.updateUser)

export default router
