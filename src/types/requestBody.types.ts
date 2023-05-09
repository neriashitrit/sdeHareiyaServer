import {
  Currency,
  TransactionSide,
  CommissionPayer,
  IFile,
  PropertyType,
} from 'safe-shore-common';

export type CreateTransactionBodyProductProperty = {
  productPropertyId: number;
  value?: string | number | boolean;
  files?: IFile;
};

export type CreateTransactionBody = {
  productCategoryId: string;
  productCategoryOther?: string | null;
  productSubcategoryId?: string | null;
  productSubcategoryOther?: string | null;
  currency: Currency;
  amount: number;
  properties: CreateTransactionBodyProductProperty[];
};

export type UpdateTransactionBody = {
  transactionId: number;
  productCategoryId?: string;
  productCategoryOther?: string | null;
  productSubcategoryId?: string | null;
  productSubcategoryOther?: string | null;
  currency?: Currency;
  amount?: number;
  properties?: CreateTransactionBodyProductProperty[];
  endDate?: string;
  commissionPayer?: CommissionPayer;
  creatorSide?: TransactionSide;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  email?: string;
};

export type ApproveStageBody = {
  transactionId: number;
  depositBankName?: string;
  depositBankNumber?: number;
  depositBankAccountOwnerFullName?: string;
  depositTransferDate?: string;
  depositReferenceNumber?: string;
  depositReferenceFile?: File;
  deliveryDate?: Date;
  deliveryType?: string;
  deliveryNotes?: string;
};

export type CreateProductCategoryBody = {
  name: string;
  icon: File;
  description: string;
  properties: {
    name: string;
    type: PropertyType;
    label: string;
    validation?: any;
    multipleFiles?: boolean;
    linesCountText?: number;
    selectOptions?: string[];
    helperText?: string;
  }[];
  subcategories: { name: string; description: string; icon: File }[];
};

export type GetTransactionParams = {
  transactionId: number;
};
