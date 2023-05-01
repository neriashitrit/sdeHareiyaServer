import { Currency, TransactionSide } from 'safe-shore-common';
import {
  CommissionPayer,
  ITransactionProductProperty,
} from 'safe-shore-common/dist/models';

export type CreateTransactionBody = {
  productCategoryId: string;
  productCategoryOther?: string | null;
  productSubcategoryId?: string | null;
  productSubcategoryOther?: string | null;
  currency: Currency;
  amount: number;
  productProperties: ITransactionProductProperty[];
};

export type UpdateTransactionBody = {
  transactionId: number;
  completed?: boolean;
  productCategoryId?: string;
  productCategoryOther?: string | null;
  productSubcategoryId?: string | null;
  productSubcategoryOther?: string | null;
  currency?: Currency;
  amount?: number;
  productProperties?: ITransactionProductProperty[];
  endDate?: string;
  commissionPayer?: CommissionPayer;
  creatorSide?: TransactionSide;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  email?: string;
};
