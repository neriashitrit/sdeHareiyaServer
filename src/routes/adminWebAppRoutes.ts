import express from 'express'

import * as adminAccountsController from '../controllers/admin/accounts.controller'
import * as adminCommissionsController from '../controllers/admin/commissions.controller'
import * as adminProductCategoriesController from '../controllers/admin/productCategories.controller'
import * as adminTransactionsController from '../controllers/admin/transactions.controller'
import * as adminUsersController from '../controllers/admin/users.controller'
import * as commissionsController from '../controllers/commissions.controller'
import * as usersController from '../controllers/users.controller'

const router = express.Router()

///////////////////////////
//      Auth            //
///////////////////////////
router.get('/getUser', usersController.getUser)

///////////////////////////
//      Users            //
///////////////////////////

router.get('/users/getAllUsers', adminUsersController.getAllAdminUsers)
router.post('/users/getUser', adminUsersController.getUserById)
router.post('/users/createAdminUser', adminUsersController.createAdminUser)
router.post('/users/updateAccountUser', adminUsersController.updateAccountUser)

///////////////////////////
//      Accounts         //
///////////////////////////

router.post('/accounts/getAllAccounts', adminAccountsController.getAllAccounts)
router.get('/accounts/getAccountById/:accountId', adminAccountsController.getAccountById)
router.post('/accounts/approveAccountAuthorization', adminAccountsController.approveAccountAuthorization)
router.post('/accounts/createBankDetails', adminAccountsController.createBankDetails)
router.post('/accounts/updateAccountBankDetails', adminAccountsController.updateAccountBankDetails)

///////////////////////////
//  Transactions         //
///////////////////////////

router.post('/transactions/getTransactionsStatusAnalytics', adminTransactionsController.getTransactionsStatusAnalytics)
router.post(
  '/transactions/getTransactionsProductsAnalytics',
  adminTransactionsController.getTransactionsProductsAnalytics
)
router.post('/transactions/approveStage', adminTransactionsController.approveStage)
router.post('/transactions/approveTransaction', adminTransactionsController.approveTransaction)
router.post('/transactions/getAllTransactions', adminTransactionsController.getAllTransactions)
router.post('/transactions/getAuthorizeTransactions', adminTransactionsController.getAuthorizedTransactions)
router.get('/transactions/getTransactionById/:transactionId', adminTransactionsController.getTransactionById)
router.post('/transactions/approveStage', adminTransactionsController.approveStage)
router.post('/transactions/settleTransactionDispute', adminTransactionsController.settleTransactionDispute)
router.post('/transactions/getTransactionsByAccount', adminTransactionsController.getTransactionsByAccount)

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
