import {
  ITransactionSide,
  ITransactionStage,
  ITransaction,
  ITransactionProductProperty,
  ITransactionDispute,
} from 'safe-shore-common';
import {
  transactionStageModel,
  transactionModel,
  transactionSideModel,
  transactionProductPropertyModel,
  productPropertyModel,
} from '../models/index';
import _ from 'lodash';
import { Tables } from '../constants';
import { transactionDisputeModel } from '../models/transactionDispute.model';

const transactionHelper = {
  isTransactionCompleted: async (transactionId: number): Promise<boolean> => {
    const transaction = (
      await transactionModel.getTransactions({
        [`${Tables.TRANSACTIONS}.id`]: transactionId,
      })
    )[0];

    //  Check basic transaction props
    if (
      _.isNil(transaction.amountCurrency) ||
      _.isNil(transaction.amount) ||
      _.isNil(transaction.commissionAmountCurrency) ||
      _.isNil(transaction.commissionAmount) ||
      _.isNil(transaction.commission) ||
      _.isNil(transaction.commissionPayer) ||
      _.isNil(transaction.endDate) ||
      _.isNil(transaction.productCategory) ||
      (transaction.productCategory.name === 'other' &&
        _.isNil(transaction.productCategoryOther)) ||
      (transaction.productCategory.name === 'cars' &&
        (_.isNil(transaction.productSubcategory) ||
          (transaction.productSubcategory.name === 'other' &&
            _.isNil(transaction.productSubcategoryOther))))
    ) {
      return false;
    }
    //  Check product properties
    const productProperties =
      await productPropertyModel.getAllProductProperties({
        productCategoryId: transaction.productCategory.id,
      });
    const transactionProductProperties =
      await transactionProductPropertyModel.getAllTransactionProductProperties({
        productCategoryId: transaction.productCategory.id,
        [`${Tables.TRANSACTION_PRODUCT_PROPERTIES}.transaction_id`]:
          transactionId,
      });

    if (
      !productProperties.every(
        (productProperty) =>
          transactionProductProperties.findIndex(
            (transactionProductProperty) =>
              transactionProductProperty.property.id === productProperty.id
          ) !== -1
      )
    ) {
      return false;
    }
    //  Check sides
    const transactionSides = await transactionSideModel.getTransactionSides({
      [`${Tables.TRANSACTION_SIDES}.transaction_id`]: transactionId,
    });

    if (transactionSides.length !== 2) {
      return false;
    }
    return true;
  },
  getFullTransaction: async ({
    transactionId,
    properties,
    sides,
    stages,
    disputes,
  }: {
    transactionId: number;
    properties?: ITransactionProductProperty[];
    sides?: ITransactionSide[];
    stages?: ITransactionStage[];
    disputes?: ITransactionDispute[];
  }): Promise<ITransaction | null> => {
    const transaction = (
      await transactionModel.getTransactions({
        [`${Tables.TRANSACTIONS}.id`]: transactionId,
      })
    )[0];

    if (!transaction) {
      return null;
    }

    if (!stages)
      stages = await transactionStageModel.getTransactionStages({
        [`${Tables.TRANSACTION_STAGES}.transaction_id`]: transaction.id,
      });

    if (!properties) {
      properties =
        await transactionProductPropertyModel.getAllTransactionProductProperties(
          {
            [`${Tables.TRANSACTION_PRODUCT_PROPERTIES}.transaction_id`]:
              transaction.id,
          }
        );
    }
    if (!disputes) {
      disputes = await transactionDisputeModel.getTransactionDisputes({
        transaction_id: transaction.id,
      });
    }
    if (!sides) {
      sides = await transactionSideModel.getTransactionSides({
        [`${Tables.TRANSACTION_SIDES}.transaction_id`]: transaction.id,
      });
    }
    transaction.properties = properties;
    transaction.sides = sides;
    transaction.disputes = disputes;
    transaction.stages = stages;
    return transaction;
  },
  getFullTransactions: async ({
    userId = 0,
    condition,
  }: {
    userId?: number;
    condition?: string;
  }): Promise<ITransaction[]> => {
    const term = condition ? condition : { [`${Tables.USERS}.id`]: userId };
    const transactions = await transactionModel.getTransactions(term);

    if (transactions.length === 0) {
      return [];
    }

    const transactionIds: number[] = transactions.map(
      (transaction) => transaction.id
    );

    const stages = await transactionStageModel.getTransactionStages(
      `${Tables.TRANSACTION_STAGES}.transaction_id IN (${transactionIds})`
    );

    const properties =
      await transactionProductPropertyModel.getAllTransactionProductProperties(
        `${Tables.TRANSACTION_PRODUCT_PROPERTIES}.transaction_id IN (${transactionIds})`
      );

    const disputes = await transactionDisputeModel.getTransactionDisputes(
      `transaction_id IN (${transactionIds})`
    );

    const sides = await transactionSideModel.getTransactionSides(
      `${Tables.TRANSACTION_SIDES}.transaction_id IN (${transactionIds})`
    );

    for (const transaction of transactions) {
      transaction.properties = properties.filter(
        (property) => property.transactionId === transaction.id
      );
      transaction.sides = sides.filter(
        (side) => side.transactionId === transaction.id
      );
      transaction.stages = stages.filter(
        (stage) => stage.transactionId === transaction.id
      );
      transaction.disputes = disputes.filter(
        (dispute) => dispute.transactionId === transaction.id
      );
    }
    return transactions;
  },
  getPendingAuthTransactions: async (
    userId: number
  ): Promise<ITransaction[]> => {
    const transactions = await transactionModel.getTransactions(
      `${Tables.USERS}.id = '${userId}' AND ${Tables.TRANSACTION_STAGES}.status = 'active' AND ${Tables.TRANSACTION_STAGES}.name IN ('authorizationSideA', 'authorizationSideB')`
    );
    return transactions;
  },
};

export default transactionHelper;
