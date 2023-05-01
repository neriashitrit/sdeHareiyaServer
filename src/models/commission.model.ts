import { ICommission } from 'safe-shore-common';
import DbService from '../services/db.service';

import { Tables } from '../constants';

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
};
