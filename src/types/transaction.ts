import { Currency } from './enums';
import { ITransactionDispute } from './transactionDispute';
import { ICommission } from './commsion';
import { IProductCategory } from './productCategory';
import { ITimestamps } from './timestamps';
import { ITransactionStage } from './transactionStage';
import { ITransactionSide } from './transactionSide';

export enum TransactionStatus {
  Dispute = 'dispute',
  Completed = 'completed',
  Canceled = 'canceled',
  Stage = 'stage',
}

export enum TransactionCancelReason {
  IncorrectDetails = 'incorrectDetails',
  BuyerSellerNotInterested = 'buyerSellerNotInterested',
  AmountDispute = 'amountDispute',
  BadProduct = 'badProduct',
  TransferFundsFailure = 'transferFundsFailure',
  Other = 'other',
}

export enum CommissionPayer {
  Buyer = 'buyer',
  Seller = 'seller',
  Both = 'both',
}

export interface ITransaction extends ITimestamps {
  id: number;
  status: TransactionStatus;
  amountCurrency: Currency;
  amount: number;
  commission: ICommission;
  commissionPayer: CommissionPayer;
  commissionAmountCurrency: Currency;
  commissionAmount: number;
  endDate: Date;
  cancelReason?: TransactionCancelReason;
  cancelReasonOther?: string;
  productCategory: IProductCategory;
  stages: ITransactionStage[];
  sides: ITransactionSide[];
  disputes: ITransactionDispute[];
}
