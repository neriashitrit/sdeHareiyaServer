import { ITimestamps } from './timestamps';

export interface IBankDetails extends ITimestamps {
  id: number;
  isActive: boolean;
  bankName: string;
  branchName: string;
  branchNumber: number;
  bankAccountOwnerFullName: string;
  bankAccountOwnerIdNumber: number;
  bankAccountNumber: number;
}
