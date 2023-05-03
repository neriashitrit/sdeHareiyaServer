import express from 'express';

import * as usersController from '../controllers/users.controller';
import * as accountsController from '../controllers/accounts.controller';

const router = express.Router();

///////////////////////////
//      Users            //
///////////////////////////

router.get('/users/getAllUsers', usersController.getAllUsers)
router.post('/users/getUser', usersController.getUserById)

///////////////////////////
//      Accounts            //
///////////////////////////

router.get('/accounts/getAllAccounts', accountsController.getAllAccounts)
router.post('/accounts/getAccount', accountsController.getAccountById)

export default router;
