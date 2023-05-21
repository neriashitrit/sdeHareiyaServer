import { CreateBankDetailsBody } from '../types/requestBody.types';
import { bankDetailsModel } from '../models/bankDetails.model';

const bankDetailsHelper = {
  createNewBankDetails: async (
    bankDetails: CreateBankDetailsBody
  ): Promise<void> => {
    await bankDetailsModel.updateBankDetails(
      { accountId: bankDetails.accountId, isActive: true },
      { isActive: false }
    );
    await bankDetailsModel.createBankDetails({
      ...bankDetails,
      isActive: true,
    });
  },
};

export default bankDetailsHelper;
