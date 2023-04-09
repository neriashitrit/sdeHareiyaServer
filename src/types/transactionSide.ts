import { TransactionSide } from './enums';
import { ITimestamps } from './timestamps';
import { IAccount } from './account';
import { IBankDetails } from './bankDetails';

export interface ITransactionSide extends ITimestamps {
  id: number;
  account: IAccount;
  bankDetails?: IBankDetails;
  side: TransactionSide;
}
