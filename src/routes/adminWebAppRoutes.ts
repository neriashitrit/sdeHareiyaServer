import express from 'express';

import * as adminUsersController from '../controllers/admin/users.controller';
import * as adminAccountsController from '../controllers/admin/accounts.controller';
import * as adminTransactionsController from '../controllers/admin/transactions.controller';
import * as commissionsController from '../controllers/commissions.controller';
import * as adminProductCategoriesController from '../controllers/admin/productCategories.controller';

const router = express.Router();

///////////////////////////
//      Users            //
///////////////////////////

router.get('/users/getAllUsers', adminUsersController.getAllUsers);
router.post('/users/getUser', adminUsersController.getUserById);

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
  adminProductCategoriesController.createProductCategories
);

export default router;
