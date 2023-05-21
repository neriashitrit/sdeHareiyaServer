import express from 'express'

import * as adminAccountsController from '../controllers/admin/accounts.controller'
import * as adminCommissionsController from '../controllers/admin/commissions.controller'
import * as adminProductCategoriesController from '../controllers/admin/productCategories.controller'
import * as adminTransactionsController from '../controllers/admin/transactions.controller'
import * as adminUsersController from '../controllers/admin/users.controller'
import * as commissionsController from '../controllers/commissions.controller'

const router = express.Router()

///////////////////////////
//      Users            //
///////////////////////////

router.get('/users/getAllUsers', adminUsersController.getAllUsers)
router.post('/users/getUser', adminUsersController.getUserById)
router.post('/users/createAdminUser', adminUsersController.createAdminUser)

///////////////////////////
//      Accounts         //
///////////////////////////

router.post('/accounts/getAllAccounts', adminAccountsController.getAllAccounts)
router.get('/accounts/getAccountById/:accountId', adminAccountsController.getAccountById)

///////////////////////////
//  Transactions         //
///////////////////////////

router.post('/transactions/getTransactionsStatusAnalytics', adminTransactionsController.getTransactionsStatusAnalytics)
router.post(
  '/transactions/getTransactionsProductsAnalytics',
  adminTransactionsController.getTransactionsProductsAnalytics
)
router.post('/transactions/approveStage', adminTransactionsController.approveStage)
router.post('/transactions/getAllTransactions', adminTransactionsController.getAllTransactions)
router.post('/transactions/getAutorizeTransactions', adminTransactionsController.getAutorizeTransactions)
router.get('/transactions/getTransactionById/:transactionId', adminTransactionsController.getTransactionById)
router.post('/transactions/approveStage', adminTransactionsController.approveStage)
router.post('/transactions/settleTransactionDispute', adminTransactionsController.settleTransactionDispute)
router.get('/transactions/getTransactionsByAccount/:accountId', adminTransactionsController.getTransactionsByAccount)

///////////////////////////
//      Commissions      //
///////////////////////////

router.get('/commissions/getActiveCommissions', commissionsController.getActiveCommissions)
router.post('/commissions/updateCommission', adminCommissionsController.updateCommission)

///////////////////////////
//   Product Categories  //
///////////////////////////
router.post('/productCategories', adminProductCategoriesController.createProductCategories)

export default router
