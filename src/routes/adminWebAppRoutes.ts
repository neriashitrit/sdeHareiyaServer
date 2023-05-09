import express from 'express';

import * as usersController from '../controllers/users.controller';
import * as accountsController from '../controllers/accounts.controller';
import * as commissionsController from '../controllers/commissions.controller';
import * as productCategoriesController from '../controllers/productCategories.controller';

const router = express.Router();

///////////////////////////
//      Users            //
///////////////////////////

router.get('/users/getAllUsers', usersController.getAllUsers);
router.post('/users/getUser', usersController.getUserById);

///////////////////////////
//      Accounts         //
///////////////////////////

router.get('/accounts/getAllAccounts', accountsController.getAllAccounts);
router.post('/accounts/getAccount', accountsController.getAccountById);

///////////////////////////
//      Commissions      //
///////////////////////////

router.get(
  '/commissions/getActiveCommissions',
  commissionsController.getActiveCommissions
);

///////////////////////////
//   Product Categories  //
///////////////////////////
router.post(
  '/productCategories',
  productCategoriesController.createProductCategories
);

export default router;
