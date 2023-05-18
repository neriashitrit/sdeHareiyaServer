import {
  Currency,
  TransactionSide,
  CommissionPayer,
  IFile,
  PropertyType,
  AccountType,
  Gender,
  ICompanyContact,
  Purpose,
  FundsSource,
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

export type AdminApproveStageBody = {
  transactionId: number;
};

export type AdminApproveDisputeBody = {
  transactionId: number;
  userId:number;
  continueTransaction:boolean;
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

export type OpenDisputeBody = {
  transactionId: number;
  reason: string;
  reasonOther?: string;
  notes: string;
};

export type CancelDisputeBody = {
  transactionId: number;
};

export type UpdateUserBody = {
  firstName: string;
  lastName: string;
};

export type AccountAuthorizationBaseBody = {
  postalCode: string;
  country: string;
  city: string;
  streetName: string;
  houseNumber: string;
  apartmentNumber: string;
  occupation: string;
};

export type AccountAuthorizationPrivateBody = AccountAuthorizationBaseBody & {
  idNumberCountryOfIssue: string;
  birthday: string;
  gender: Gender;
  isThirdParty: boolean;
  isThirdPartyFullName?: string;
  isBankAccountBlocked: boolean;
};

export type AccountAuthorizationCompanyBody = AccountAuthorizationBaseBody & {
  companyIdentityNumber: number;
  incorporationName: string;
  incorporationDate: string;
  incorporationCountry: string;
  fundsSource: FundsSource;
  fundsSourceOther?: string;
  contacts: ICompanyContact[];
  activeYears: number;
  purpose: Purpose;
};

export type AccountAuthorizationBody =
  | AccountAuthorizationPrivateBody
  | AccountAuthorizationCompanyBody;
