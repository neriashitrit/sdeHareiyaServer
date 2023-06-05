import { TransactionSide, TransactionStageName, TransactionStageStatus, TransactionStatus } from 'safe-shore-common'

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
  FILES = 'files'
}

export const transactionStagePossiblePaths: {
  [key in TransactionStageName]: TransactionStageName[]
} = {
  [TransactionStageName.Draft]: [TransactionStageName.AuthorizationSideA, TransactionStageName.ConfirmationSideB],
  [TransactionStageName.AuthorizationSideA]: [TransactionStageName.AuthorizationSideAConfirmation],
  [TransactionStageName.AuthorizationSideAConfirmation]: [TransactionStageName.ConfirmationSideB],
  [TransactionStageName.ConfirmationSideB]: [
    TransactionStageName.AuthorizationSideB,
    TransactionStageName.BuyerDeposit
  ],
  [TransactionStageName.AuthorizationSideB]: [TransactionStageName.AuthorizationSideBConfirmation],
  [TransactionStageName.AuthorizationSideBConfirmation]: [TransactionStageName.BuyerDeposit],
  [TransactionStageName.BuyerDeposit]: [TransactionStageName.DepositConfirmation],
  [TransactionStageName.DepositConfirmation]: [TransactionStageName.SellerProductTransfer],
  [TransactionStageName.SellerProductTransfer]: [TransactionStageName.BuyerProductConfirmation],
  [TransactionStageName.BuyerProductConfirmation]: [TransactionStageName.SellerPayment],
  [TransactionStageName.SellerPayment]: [TransactionStageName.Completed],
  [TransactionStageName.Completed]: []
}

export const transactionStageInCharge: {
  [key in TransactionStageName]: TransactionSide
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
  [TransactionStageName.Completed]: TransactionSide.Admin
}

export enum EmailTemplateName {
  SIGN_UP_COMPLETED = 'signUpCompleted',
  PROFILE_UPDATE = 'profileUpdate',
  CONTACT_US = 'contactUs',

  TRANSACTION_OPEN = 'transactionOpen',
  ACCOUNT_AUTHORIZED = 'accountAuthorized',
  TRANSACTION_INVITE_CONFIRMATION = 'transactionInviteConfirmation',
  TRANSACTION_ACCEPTED_CONFIRMATION = 'transactionAcceptedConfirmation',
  DEPOSIT_TRANSFER = 'depositTransfer',
  DEPOSIT_TRANSFER_SUCCESSFUL = 'depositTransferSuccessful',
  PRODUCT_TRANSFER = 'productTransfer',
  PRODUCT_TRANSFER_COMPLETED = 'productTransferCompleted',
  TRANSACTION_COMPLETED = 'transactionCompleted',

  OPEN_DISPUTE = 'openDispute',
  RESOLVED_DISPUTE = 'resolvedDispute',
  TRANSACTION_CANCEL = 'transactionCancel'
}

export const transactionStageToEmailTriggerMapping: {
  [key in TransactionStageName]: { to: TransactionSide; subject: string; template: EmailTemplateName }[] | null
} = {
  [TransactionStageName.Draft]: null,
  [TransactionStageName.AuthorizationSideA]: [
    {
      to: TransactionSide.SideA,
      subject: `${EmailTemplateName.TRANSACTION_OPEN}`,
      template: EmailTemplateName.TRANSACTION_OPEN
    }
  ],
  [TransactionStageName.AuthorizationSideAConfirmation]: [
    {
      to: TransactionSide.SideA,
      subject: `${EmailTemplateName.ACCOUNT_AUTHORIZED}`,
      template: EmailTemplateName.ACCOUNT_AUTHORIZED
    }
  ],
  [TransactionStageName.AuthorizationSideB]: null,
  [TransactionStageName.AuthorizationSideBConfirmation]: [
    {
      to: TransactionSide.SideB,
      subject: `${EmailTemplateName.ACCOUNT_AUTHORIZED}`,
      template: EmailTemplateName.ACCOUNT_AUTHORIZED
    }
  ],
  [TransactionStageName.ConfirmationSideB]: [
    {
      to: TransactionSide.SideA,
      subject: `${EmailTemplateName.TRANSACTION_OPEN}`,
      template: EmailTemplateName.TRANSACTION_OPEN
    },
    {
      to: TransactionSide.SideB,
      subject: `${EmailTemplateName.TRANSACTION_INVITE_CONFIRMATION}`,
      template: EmailTemplateName.TRANSACTION_INVITE_CONFIRMATION
    }
  ],
  [TransactionStageName.BuyerDeposit]: [
    {
      to: TransactionSide.SideA,
      subject: `${EmailTemplateName.TRANSACTION_ACCEPTED_CONFIRMATION}`,
      template: EmailTemplateName.TRANSACTION_ACCEPTED_CONFIRMATION
    }
  ],
  [TransactionStageName.DepositConfirmation]: [
    {
      to: TransactionSide.Admin,
      subject: `${EmailTemplateName.DEPOSIT_TRANSFER}`,
      template: EmailTemplateName.DEPOSIT_TRANSFER
    }
  ],
  [TransactionStageName.SellerProductTransfer]: [
    {
      to: TransactionSide.Buyer,
      subject: `${EmailTemplateName.DEPOSIT_TRANSFER_SUCCESSFUL}`,
      template: EmailTemplateName.DEPOSIT_TRANSFER_SUCCESSFUL
    },
    {
      to: TransactionSide.Seller,
      subject: `${EmailTemplateName.DEPOSIT_TRANSFER_SUCCESSFUL}`,
      template: EmailTemplateName.DEPOSIT_TRANSFER_SUCCESSFUL
    }
  ],
  [TransactionStageName.BuyerProductConfirmation]: [
    {
      to: TransactionSide.Buyer,
      subject: `${EmailTemplateName.PRODUCT_TRANSFER}`,
      template: EmailTemplateName.PRODUCT_TRANSFER
    }
  ],
  [TransactionStageName.SellerPayment]: [
    {
      to: TransactionSide.Seller,
      subject: `${EmailTemplateName.PRODUCT_TRANSFER_COMPLETED}`,
      template: EmailTemplateName.PRODUCT_TRANSFER_COMPLETED
    }
  ],
  [TransactionStageName.Completed]: [
    {
      to: TransactionSide.Buyer,
      subject: `${EmailTemplateName.TRANSACTION_COMPLETED}`,
      template: EmailTemplateName.TRANSACTION_COMPLETED
    },
    {
      to: TransactionSide.Seller,
      subject: `${EmailTemplateName.TRANSACTION_COMPLETED}`,
      template: EmailTemplateName.TRANSACTION_COMPLETED
    }
  ]
}

export const conditionForTransactionsNeedStageAuthorization = [
  {
    column: Tables.TRANSACTIONS + '.status',
    operator: 'in',
    value: [TransactionStatus.Stage]
  },
  {
    column: Tables.TRANSACTION_STAGES + '.in_charge',
    value: TransactionSide.Admin
  },
  {
    column: Tables.TRANSACTION_STAGES + '.status',
    value: TransactionStageStatus.Active
  }
]

export const conditionForTransactionsNeedDisputeAuthorization = [
  {
    column: Tables.TRANSACTIONS + '.status',
    operator: 'in',
    value: [TransactionStatus.Dispute]
  }
]
