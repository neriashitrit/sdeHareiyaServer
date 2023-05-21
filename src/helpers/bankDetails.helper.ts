import { bankDetailsModel } from '../models/bankDetails.model'
import { CreateBankDetailsBody } from '../types/requestBody.types'

const bankDetailsHelper = {
  createNewBankDetails: async (bankDetails: CreateBankDetailsBody): Promise<void> => {
    await bankDetailsModel.updateBankDetails({ accountId: bankDetails.accountId, isActive: true }, { isActive: false })
    await bankDetailsModel.createBankDetails({
      ...bankDetails,
      isActive: true
    })
  }
}

export default bankDetailsHelper
