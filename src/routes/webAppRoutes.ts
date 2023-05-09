import express from 'express';

import * as usersController from '../controllers/users.controller';
import * as transactionsController from '../controllers/transactions.controller';
import * as globalController from '../controllers/global.controller';

const router = express.Router();
// users
router.post('/user/login', usersController.userLogin);
// router.get('/user/getAll', usersController.getAllCompanyUsers)
// router.get('/user/getOne', usersController.getUser)
// router.post('/user/contactUs', usersController.sendContactUs)

//  transactions
router.get('/getTransactions', transactionsController.getTransactions);
router.get(
  '/getTransactionsById/:transactionId',
  transactionsController.getTransaction
);
router.post('/createTransactions', transactionsController.createTransaction);
router.put('/updateTransactions', transactionsController.updateTransaction);
router.post('/transactions/approveStage', transactionsController.approveStage);

// global
// router.post('/global/uploadAvatar', globalController.uploadAvatar)
// router.get('/global/getAvatar', globalController.getAvatar)
// router.get('/global/getSAS', globalController.getSAS)

export default router;
