import express from 'express';

import * as usersController from '../controllers/users.controller';
import * as transactionsController from '../controllers/transactions.controller';
import * as accountsController from '../controllers/accounts.controller';

const router = express.Router();

///////////////////////////
//         Users         //
///////////////////////////
router.post('/user/login', usersController.userLogin);
router.get('/getUser', usersController.getUser);
router.put('/updateUser', usersController.updateUser);

///////////////////////////
//     Transactions      //
///////////////////////////
router.get('/getTransactions', transactionsController.getTransactions);
router.get(
  '/getTransactionsById/:transactionId',
  transactionsController.getTransaction
);
router.post('/createTransactions', transactionsController.createTransaction);
router.put('/updateTransactions', transactionsController.updateTransaction);
router.post('/transactions/approveStage', transactionsController.approveStage);
router.post('/transactions/openDispute', transactionsController.openDispute);
router.post(
  '/transactions/cancelDispute',
  transactionsController.cancelDispute
);
///////////////////////////
//       Accounts        //
///////////////////////////
router.post(
  '/accounts/submitAccountAuthorization',
  accountsController.submitAccountAuthorization
);
router.get('/getAccount', accountsController.getAccount);

export default router;
