import { ITimestamps } from './timestamps';

export enum CommissionType {
  Percentage = 'percentage',
  Fixed = 'fixed',
}
export interface ICommission extends ITimestamps {
  id: number;
  isActive: boolean;
  from: number;
  to: number;
  type: CommissionType;
  amount: number;
}
