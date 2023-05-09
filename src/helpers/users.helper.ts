import { AuthInfo } from 'types';
import { accountModel, userAccountModel, userModel } from '../models/index';
import { AccountType, IAccount, IUser, IUserAccount } from 'safe-shore-common';

const usersHelper = {
  createUserFromToken: async (
    authInfo: AuthInfo
  ): Promise<[IUser, IAccount, IUserAccount]> => {
    const firstName = authInfo.given_name;
    const lastName = authInfo.family_name;
    const email = authInfo.emails[0];
    const activeDirectoryUuid = authInfo.oid;
    const phoneNumber = '';
    const newsletterSubscription = true;
    const lastActiveAt = new Date();
    const accountType = authInfo.extension_account_type ?? 'private';

    try {
      const newUser = await userModel.createUser({
        firstName,
        lastName,
        email,
        activeDirectoryUuid,
        phoneNumber,
        newsletterSubscription,
        lastActiveAt,
        isActive: true,
      });

      const newAccount = await accountModel.createAccount({
        type: accountType,
      });

      const newUserAccount = await userAccountModel.createUserAccount({
        userId: newUser.id,
        accountId: newAccount.id,
      });

      return [newUser, newAccount, newUserAccount];
    } catch (error) {
      console.error(
        'ERROR in users.helper createUserFromToken()',
        error.message
      );
      throw {
        message: `error while trying to createUserFromToken. error: ${error.message}`,
      };
    }
  },
  createNotActivatedUser: async (
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string
  ): Promise<[IUser, IAccount, IUserAccount]> => {
    try {
      const newUser = await userModel.createUser({
        firstName,
        lastName,
        email,
        phoneNumber,
        lastActiveAt: new Date(),
        isActive: false,
        isActivated: false,
      });

      const newAccount = await accountModel.createAccount({
        type: AccountType.Private,
      });

      const newUserAccount = await userAccountModel.createUserAccount({
        userId: newUser.id,
        accountId: newAccount.id,
      });

      return [newUser, newAccount, newUserAccount];
    } catch (error) {
      console.error(
        'ERROR in users.helper createNotActivatedUser()',
        error.message
      );
      throw {
        message: `error while trying to createNotActivatedUser. error: ${error.message}`,
      };
    }
  },
};
export default usersHelper;
