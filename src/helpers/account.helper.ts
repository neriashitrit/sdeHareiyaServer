import { AccountType, AuthorizationStatus } from 'safe-shore-common'

import { Tables } from '../constants'
import { accountModel, fileModel, userModel } from '../models'
import { AccountAuthorizationCompanyBody, AccountAuthorizationPrivateBody } from '../types/requestBody.types'

const accountHelper = {
  submitPrivateAccountAuthorization: async (
    userId: number,
    accountAuthorizationPrivateBody: AccountAuthorizationPrivateBody
  ): Promise<boolean> => {
    const account = await accountModel.getAccount({
      [`${Tables.USERS}.id`]: userId,
      type: AccountType.Private,
      authorizationStatus: AuthorizationStatus.NotAuthorized
    })

    if (account.length === 0) {
      return false
    }

    const {
      postalCode,
      country,
      city,
      streetName,
      houseNumber,
      apartmentNumber,
      occupation,
      idNumberCountryOfIssue,
      isThirdParty,
      thirdPartyFullName,
      isBankAccountBlocked,
      birthday,
      gender,
      files
    } = accountAuthorizationPrivateBody

    await accountModel.updateAccount(
      {
        postalCode,
        country,
        city,
        streetName,
        houseNumber,
        apartmentNumber,
        occupation,
        isThirdParty,
        thirdPartyFullName,
        isBankAccountBlocked,
        authorizationStatus: AuthorizationStatus.Pending
      },
      {
        id: account[0].id
      }
    )
    for (const file of files) {
      await fileModel.updateFiles({ url: file }, { rowId: account[0].id, tableName: Tables.ACCOUNTS })
    }
    await userModel.updateUser(
      {
        birthday,
        gender,
        idNumberCountryOfIssue
      },
      {
        id: userId
      }
    )
    return true
  },
  submitCompanyAccountAuthorization: async (
    userId: number,
    accountAuthorizationCompanyBody: AccountAuthorizationCompanyBody
  ): Promise<boolean> => {
    const account = await accountModel.getAccount({
      [`${Tables.USERS}.id`]: userId,
      type: AccountType.Company,
      authorizationStatus: AuthorizationStatus.NotAuthorized
    })

    if (account.length === 0) {
      return false
    }

    const {
      postalCode,
      country,
      city,
      streetName,
      houseNumber,
      apartmentNumber,
      occupation,
      companyIdentityNumber,
      incorporationName,
      incorporationDate,
      incorporationCountry,
      fundsSource,
      fundsSourceOther,
      contacts,
      activeYears,
      purpose
    } = accountAuthorizationCompanyBody

    await accountModel.createCompanyDetails({
      companyIdentityNumber,
      incorporationName,
      incorporationDate,
      incorporationCountry,
      fundsSource,
      fundsSourceOther,
      contacts: JSON.stringify(contacts),
      activeYears,
      purpose,
      accountId: account[0].id
    })

    await accountModel.updateAccount(
      {
        postalCode,
        country,
        city,
        streetName,
        houseNumber,
        apartmentNumber,
        occupation,
        authorizationStatus: AuthorizationStatus.Pending
      },
      {
        id: account[0].id
      }
    )
    return true
  },
  approveAccountAuthorization: async (
    accountId: number,
    authorizationStatus: AuthorizationStatus
  ): Promise<boolean> => {
    const account = await accountModel.updateAccount(
      {
        authorizationStatus
      },
      {
        [`${Tables.ACCOUNTS}.id`]: accountId
      }
    )

    if (account.length === 0) {
      return false
    }
    return true
  }
}

export default accountHelper
