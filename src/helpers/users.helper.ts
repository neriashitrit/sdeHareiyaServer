import { AuthInfo } from 'types';
import UserModel from '../models/users.model';
import { IUser, UserRole } from '../types/user';

const userModel = new UserModel();

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
      const user: Partial<IUser> = {
        firstName,
        lastName,
        email,
        activeDirectoryUuid,
        role: UserRole.User,
        phoneNumber,
        newsletterSubscription,
        lastActiveAt,
      };
      const newUser = await userModel.createUser(user);
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
