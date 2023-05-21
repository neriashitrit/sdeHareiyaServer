import { CommissionType, ICommission } from 'safe-shore-common';
import DbService from '../services/db.service';

import { Tables } from '../constants';
import _ from 'lodash';
import knex from 'knex';

const db = new DbService();

export const commissionModel = {
  getCommissions: async (
    condition: Record<string, any> | string
  ): Promise<ICommission[]> => {
    try {
      const commission = await db.getAll(Tables.COMMISSIONS, condition);
      return commission;
    } catch (error) {
      console.error('ERROR in commission.modal getCommission()', error.message);
      throw {
        message: `error while trying to getCommission. error: ${error.message}`,
      };
    }
  },
  createCommission: async (
    commission: Record<string, number | CommissionType | boolean>
  ): Promise<ICommission> => {
    try {
      const newCommission = await db
      .insert(Tables.COMMISSIONS,[commission, _.omit(commission,'id')])
      .onConflict('id')
      .merge({ is_active: false })
      .returning('*')
      return newCommission?.[newCommission.length - 1];
    } catch (error) {
      console.error('ERROR in Commission.modal createCommission()', error.message);
      throw {
        message: `error while trying to createCommission. error: ${error.message}`,
      };
    }
  }
};
