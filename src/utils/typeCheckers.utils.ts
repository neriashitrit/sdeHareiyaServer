import _ from 'lodash';
import {
  CreateTransactionBody,
  UpdateTransactionBody,
} from 'types/requestBody.types';

export const isUpdateTransactionBody = (
  body: any
): body is UpdateTransactionBody => {
  return (
    typeof body === 'object' &&
    body !== null &&
    typeof body.transactionId === 'number' &&
    (_.isNil(body.completed) || typeof body.completed === 'boolean') &&
    (_.isNil(body.productCategoryId) ||
      typeof body.productCategoryId === 'string') &&
    (_.isNil(body.productCategoryOther) ||
      typeof body.productCategoryOther === 'string') &&
    (_.isNil(body.currency) || typeof body.currency === 'string') &&
    (_.isNil(body.amount) || typeof body.amount === 'number') &&
    (_.isNil(body.productProperties) ||
      Array.isArray(body.productProperties)) &&
    (_.isNil(body.endDate) || typeof body.endDate === 'string') &&
    (_.isNil(body.commissionPayer) ||
      typeof body.commissionPayer === 'string') &&
    (_.isNil(body.creatorSide) || typeof body.creatorSide === 'string') &&
    (_.isNil(body.firstName) || typeof body.firstName === 'string') &&
    (_.isNil(body.lastName) || typeof body.lastName === 'string') &&
    (_.isNil(body.phoneNumber) || typeof body.phoneNumber === 'string') &&
    (_.isNil(body.email) || typeof body.email === 'string')
  );
};

export const isCreateTransactionBody = (
  body: any
): body is CreateTransactionBody => {
  return (
    typeof body === 'object' &&
    !_.isNil(body) &&
    typeof body.productCategoryId === 'string' &&
    (_.isNil(body.productCategoryOther) ||
      typeof body.productCategoryOther === 'string') &&
    typeof body.currency === 'string' &&
    typeof body.amount === 'number' &&
    Array.isArray(body.productProperties)
  );
};
