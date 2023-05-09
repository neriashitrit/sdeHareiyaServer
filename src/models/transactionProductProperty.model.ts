import DbService from '../services/db.service';

import _ from 'lodash';
import { Tables } from '../constants';
import { ITransactionProductProperty } from 'safe-shore-common';
import { getJsonBuildObject } from '../utils/db.utils';

const db = new DbService();

export const transactionProductPropertyModel = {
  getTransactionProductProperty: async (
    condition: Record<string, any> | string
  ): Promise<ITransactionProductProperty | undefined> => {
    try {
      const transactionProductProperties = await db.knex
        .queryBuilder()
        .select(
          'tpp.id',
          'tpp.value',
          'tpp.transaction_id',
          db.knex.raw(
            `JSON_BUILD_OBJECT(${getJsonBuildObject(Tables.PRODUCT_PROPERTIES, [
              'pp',
            ])}) as property`
          )
        )
        .from(`${Tables.TRANSACTION_PRODUCT_PROPERTIES} as tpp`)
        .where(condition)
        .leftJoin(
          `${Tables.PRODUCT_PROPERTIES} as pp`,
          `tpp.product_property_id`,
          'pp.id'
        )
        .groupBy('tpp.id', 'pp.id')
        .first();
      return transactionProductProperties;
    } catch (error) {
      console.error(
        'ERROR in transactionProductPropertyModel.modal getTransactionProductProperty()',
        error.message
      );
      throw {
        message: `error while trying to getTransactionProductProperty. error: ${error.message}`,
      };
    }
  },
  getAllTransactionProductProperties: async (
    condition: Record<string, any> | string
  ): Promise<ITransactionProductProperty[]> => {
    try {
      if (typeof condition === 'string') {
        condition = db.knex.raw(condition);
      }
      const transactionProductProperties = await db.knex
        .queryBuilder()
        .select(
          'tpp.id',
          'tpp.value',
          'tpp.transaction_id',
          db.knex.raw(
            `JSON_BUILD_OBJECT(${getJsonBuildObject(Tables.PRODUCT_PROPERTIES, [
              'pp',
            ])}) as property`
          )
        )
        .from(`${Tables.TRANSACTION_PRODUCT_PROPERTIES} as tpp`)
        .where(condition)
        .leftJoin(
          `${Tables.PRODUCT_PROPERTIES} as pp`,
          `tpp.product_property_id`,
          'pp.id'
        )
        .groupBy('tpp.id', 'pp.id');
      return transactionProductProperties;
    } catch (error) {
      console.error(
        'ERROR in transactionProductPropertyModel.modal getTransactionProductProperty()',
        error.message
      );
      throw {
        message: `error while trying to getTransactionProductProperty. error: ${error.message}`,
      };
    }
  },
  createTransactionProductProperty: async (
    newTransactionProductProperty: Record<string, any>
  ): Promise<ITransactionProductProperty> => {
    try {
      const transactionProductProperties = await db.insert(
        Tables.TRANSACTION_PRODUCT_PROPERTIES,
        newTransactionProductProperty
      );
      return transactionProductProperties?.[0];
    } catch (error) {
      console.error(
        'ERROR in transactionProductPropertyModel.modal createTransactionProductProperty()',
        error.message
      );
      throw {
        message: `error while trying to createTransactionProductProperty. error: ${error.message}`,
      };
    }
  },
  updateTransactionProductProperty: async (
    updatedTransactionProductProperty: Record<string, any>,
    condition: Record<string, any> | string
  ): Promise<ITransactionProductProperty | undefined> => {
    try {
      const transactionProductProperties = await db.update(
        Tables.TRANSACTION_PRODUCT_PROPERTIES,
        updatedTransactionProductProperty,
        condition
      );
      return transactionProductProperties?.[0];
    } catch (error) {
      console.error(
        'ERROR in transactionProductPropertyModel.modal updateTransactionProductProperty()',
        error.message
      );
      throw {
        message: `error while trying to updateTransactionProductProperty. error: ${error.message}`,
      };
    }
  },
};
