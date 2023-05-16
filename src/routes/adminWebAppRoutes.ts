import express from 'express';

import * as usersController from '../controllers/users.controller';
import * as adminAccountsController from '../controllers/admin/accounts.controller';
import * as adminTransactionsController from '../controllers/admin/transactions.controller';
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

router.post('/accounts/getAllAccounts', adminAccountsController.getAllAccounts);
router.post('/accounts/getAccount', adminAccountsController.getAccountById);

///////////////////////////
//  Transactions         //
///////////////////////////

router.post(
  '/transactions/getTransactionsStatusAnalytics',
  adminTransactionsController.getTransactionsStatusAnalytics
);
router.post(
  '/transactions/getTransactionsProductsAnalytics',
  adminTransactionsController.getTransactionsProductsAnalytics
);
router.post(
  '/transactions/approveStage',
  adminTransactionsController.approveStage
);

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
