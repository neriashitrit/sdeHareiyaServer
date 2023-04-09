import { TransactionSide } from './enums';
import { ITimestamps } from './timestamps';
import { IUser } from './user';

export enum DisputeReason {
  CooperationSeller = 'cooperationSeller',
  CooperationBuyer = 'cooperationBuyer',
  CancelTransaction = 'cancelTransaction',
  CheckPaymentTermsDeposits = 'checkPaymentTermsDeposits',
  NotReceivedProduct = 'notReceivedProduct',
  IncorrectDamagedProduct = 'incorrectDamagedProduct',
  TransactionTerms = 'transactionTerms',
  Other = 'other',
}

export interface ITransactionDispute extends ITimestamps {
  id: number;
  isCompleted: boolean;
  requestingSide: TransactionSide;
  user?: IUser;
  reason: DisputeReason;
  reasonOther: string;
  notes?: string;
}
