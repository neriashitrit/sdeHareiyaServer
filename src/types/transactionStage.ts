import { TransactionSide } from './enums';
import { IUser } from './user';

export enum TransactionStageName {
  DraftS2 = 'draft s2',
  DraftS3 = 'draft s3',
  DraftS4 = 'draft s4',
  AuthorizationSideA = 'authorizationSideA',
  ConfirmationSideB = 'confirmationSideB',
  BuyerDeposit = 'buyerDeposit',
  DepositConfirmation = 'depositConfirmation',
  SellerProductDelivery = 'sellerProductDelivery',
  BuyerProductConfirmation = 'buyerProductConfirmation',
  SellerPayment = 'sellerPayment',
}

export enum TransactionStageStatus {
  Completed = 'completed',
  Working = 'working',
}

export interface ITransactionStage {
  id: number;
  name: TransactionStageName;
  inCharge: TransactionSide;
  user?: IUser;
  status: TransactionStageStatus;
  additionalData?: { [key: string]: any };
}
