import express from 'express';

import * as usersController from '../controllers/users.controller';
import * as globalController from '../controllers/global.controller';

const router = express.Router();
// users
router.post('/user/login', usersController.userLogin);
// router.get('/user/getAll', usersController.getAllCompanyUsers)
// router.get('/user/getOne', usersController.getUser)
// router.post('/user/contactUs', usersController.sendContactUs)

// global
// router.post('/global/uploadAvatar', globalController.uploadAvatar)
// router.get('/global/getAvatar', globalController.getAvatar)
// router.get('/global/getSAS', globalController.getSAS)

export default router;
