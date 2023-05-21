import { IBankDetails } from 'safe-shore-common';
import DbService from '../services/db.service';

import { Tables } from '../constants';

const db = new DbService();

export const bankDetailsModel = {
  createBankDetails: async (
    newBankDetails: Record<string, any>
  ): Promise<IBankDetails[]> => {
    try {
      const bankDetails = await db.insert(Tables.BANK_DETAILS, newBankDetails);
      return bankDetails;
    } catch (error) {
      console.error(
        'ERROR in bankDetails.modal createBankDetails()',
        error.message
      );
      throw {
        message: `error while trying to createBankDetails. error: ${error.message}`,
      };
    }
  },
  updateBankDetails: async (
    condition: Record<string, any> | string,
    updatedBankDetails: Record<string, any>
  ): Promise<IBankDetails[]> => {
    try {
      const bankDetails = await db.update(
        Tables.BANK_DETAILS,
        updatedBankDetails,
        condition
      );
      return bankDetails;
    } catch (error) {
      console.error(
        'ERROR in bankDetails.modal updateBankDetails()',
        error.message
      );
      throw {
        message: `error while trying to updateBankDetails. error: ${error.message}`,
      };
    }
  },
};
