import { AuthInfo } from 'types';
import { userModel } from '../models/index';
import { IUser } from 'safe-shore-common';

const usersHelper = {
  createUser: async (authInfo: AuthInfo): Promise<IUser> => {
    const firstName = authInfo.given_name;
    const lastName = authInfo.family_name;
    const email = authInfo.emails[0];
    const activeDirectoryUuid = authInfo.oid;
    const phoneNumber = '';
    const newsletterSubscription = true;
    const lastActiveAt = new Date();
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
      return newUser;
    } catch (error) {
      console.error('ERROR in users.helper createUser()', error.message);
      throw {
        message: `error while trying to create user ${firstName} ${lastName}. error: ${error.message}`,
      };
    }
  },
};
export default usersHelper;
