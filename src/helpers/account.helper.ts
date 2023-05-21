import { accountModel, userModel } from '../models';
import {
  AccountAuthorizationCompanyBody,
  AccountAuthorizationPrivateBody,
} from '../types/requestBody.types';
import { Tables } from '../constants';
import { AccountType, AuthorizationStatus } from 'safe-shore-common';
const accountHelper = {
  privateAccountAuthorization: async (
    userId: number,
    accountAuthorizationPrivateBody: AccountAuthorizationPrivateBody
  ): Promise<boolean> => {
    const account = await accountModel.getAccount({
      [`${Tables.USERS}.id`]: userId,
      type: AccountType.Private,
      authorizationStatus: AuthorizationStatus.NotAuthorized,
    });

    if (account.length === 0) {
      return false;
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
    } = accountAuthorizationPrivateBody;

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
        authorizationStatus: AuthorizationStatus.Pending,
      },
      {
        id: account[0].id,
      }
    );
    await userModel.updateUser(
      {
        birthday,
        gender,
        idNumberCountryOfIssue,
      },
      {
        id: userId,
      }
    );
    return true;
  },
  companyAccountAuthorization: async (
    userId: number,
    accountAuthorizationCompanyBody: AccountAuthorizationCompanyBody
  ): Promise<boolean> => {
    const account = await accountModel.getAccount({
      [`${Tables.USERS}.id`]: userId,
      type: AccountType.Company,
      authorizationStatus: AuthorizationStatus.NotAuthorized,
    });

    if (account.length === 0) {
      return false;
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
      purpose,
    } = accountAuthorizationCompanyBody;

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
      accountId: account[0].id,
    });

    await accountModel.updateAccount(
      {
        postalCode,
        country,
        city,
        streetName,
        houseNumber,
        apartmentNumber,
        occupation,
        authorizationStatus: AuthorizationStatus.Pending,
      },
      {
        id: account[0].id,
      }
    );
    return true;
  },
};

export default accountHelper;
