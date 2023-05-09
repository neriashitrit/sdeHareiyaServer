import express from 'express';

import * as usersController from '../controllers/users.controller';
import * as accountsController from '../controllers/admin/accounts.controller';
import * as transactionsController from '../controllers/admin/transactions.controller';
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

router.post('/accounts/getAllAccounts', accountsController.getAllAccounts)
router.post('/accounts/getAccount', accountsController.getAccountById)

///////////////////////////
//  Transactions         //
///////////////////////////

router.post('/transactions/getTransactionsStatusAnalytics', transactionsController.getTransactionsStatusAnalytics)
router.post('/transactions/getTransactionsProductsAnalytics', transactionsController.getTransactionsProductsAnalytics)

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
