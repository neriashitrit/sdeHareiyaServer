import { TransactionSide, TransactionStageName, TransactionStageStatus, TransactionStatus } from 'safe-shore-common';

export enum Tables {
  USERS = 'users',
  ACCOUNTS = 'accounts',
  USER_ACCOUNTS = 'user_accounts',
  AUDIT = 'audit',
  COMPANY_DETAILS = 'company_details',
  BANK_DETAILS = 'bank_details',
  TRANSACTIONS = 'transactions',
  TRANSACTION_DISPUTES = 'transaction_disputes',
  TRANSACTION_STAGES = 'transaction_stages',
  TRANSACTION_SIDES = 'transaction_sides',
  COMMISSIONS = 'commissions',
  PRODUCT_CATEGORIES = 'product_categories',
  PRODUCT_SUBCATEGORIES = 'product_subcategories',
  PRODUCT_PROPERTIES = 'product_properties',
  TRANSACTION_PRODUCT_PROPERTIES = 'transaction_product_properties',
  FILES = 'files',
}

export const transactionStagePossiblePaths: {
  [key in TransactionStageName]: TransactionStageName[];
} = {
  [TransactionStageName.Draft]: [
    TransactionStageName.AuthorizationSideA,
    TransactionStageName.ConfirmationSideB,
  ],
  [TransactionStageName.AuthorizationSideA]: [
    TransactionStageName.AuthorizationSideAConfirmation,
  ],
  [TransactionStageName.AuthorizationSideAConfirmation]: [
    TransactionStageName.ConfirmationSideB,
  ],
  [TransactionStageName.ConfirmationSideB]: [
    TransactionStageName.AuthorizationSideB,
    TransactionStageName.BuyerDeposit,
  ],
  [TransactionStageName.AuthorizationSideB]: [
    TransactionStageName.AuthorizationSideBConfirmation,
  ],
  [TransactionStageName.AuthorizationSideBConfirmation]: [
    TransactionStageName.BuyerDeposit,
  ],
  [TransactionStageName.BuyerDeposit]: [
    TransactionStageName.DepositConfirmation,
  ],
  [TransactionStageName.DepositConfirmation]: [
    TransactionStageName.SellerProductTransfer,
  ],
  [TransactionStageName.SellerProductTransfer]: [
    TransactionStageName.BuyerProductConfirmation,
  ],
  [TransactionStageName.BuyerProductConfirmation]: [
    TransactionStageName.SellerPayment,
  ],
  [TransactionStageName.SellerPayment]: [TransactionStageName.Completed],
  [TransactionStageName.Completed]: [],
};

export const transactionStageInCharge: {
  [key in TransactionStageName]: TransactionSide;
} = {
  [TransactionStageName.Draft]: TransactionSide.SideA,
  [TransactionStageName.AuthorizationSideA]: TransactionSide.SideA,
  [TransactionStageName.AuthorizationSideAConfirmation]: TransactionSide.Admin,
  [TransactionStageName.AuthorizationSideB]: TransactionSide.SideB,
  [TransactionStageName.AuthorizationSideBConfirmation]: TransactionSide.Admin,
  [TransactionStageName.ConfirmationSideB]: TransactionSide.SideB,
  [TransactionStageName.BuyerDeposit]: TransactionSide.Buyer,
  [TransactionStageName.DepositConfirmation]: TransactionSide.Admin,
  [TransactionStageName.SellerProductTransfer]: TransactionSide.Seller,
  [TransactionStageName.BuyerProductConfirmation]: TransactionSide.Buyer,
  [TransactionStageName.SellerPayment]: TransactionSide.Admin,
  [TransactionStageName.Completed]: TransactionSide.Admin,
};

export const conditionForTransactionsNeedAutorization = [
  {
    column:Tables.TRANSACTIONS+'.status',
    operator:'in',
    value:[TransactionStatus.Stage,TransactionStatus.Dispute]
  },
  {
    column:Tables.TRANSACTION_STAGES+'.in_charge',
    value:TransactionSide.Admin
  },
  {
    column:Tables.TRANSACTION_STAGES+'.status',
    value:TransactionStageStatus.Active
  },
]