import express from 'express'

import * as usersController from '../controllers/users.controller'
import * as adminController from '../controllers/admin.controller'

const router = express.Router()

///////////////////////////
//         Users         //
///////////////////////////
router.post('/createUser', usersController.createUser)

///////////////////////////
//         Admin         //
///////////////////////////
router.get('/getAllUsers', adminController.getUsers)
router.post('/adminLogin', adminController.login)


export default router
