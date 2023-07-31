import { AccountType, IAccount, IUser, IUserAccount, UserRole } from 'safe-shore-common'
import { AuthInfo } from 'types'

import { companyDetailsModel } from '../models/companyDetails.model'
import { accountModel, userAccountModel, userModel } from '../models/index'

const usersHelper = {
  createUserFromToken: async (authInfo: AuthInfo): Promise<[IUser, IAccount, IUserAccount]> => {
    const firstName = authInfo.given_name
    const lastName = authInfo.family_name
    const email = authInfo.emails[0]
    const activeDirectoryUuid = authInfo.oid
    const newsletterSubscription = true
    const lastActiveAt = new Date()
    const type = authInfo.extension_companyBN ? AccountType.Company : AccountType.Private
    const idNumber = authInfo.extension_IDnumber
    const phoneNumber = authInfo.extension_phone
    const companyIdentityNumber = authInfo.extension_companyBN
    const incorporationName = authInfo.extension_companyname

    try {
      const newUser = await userModel.createUser({
        firstName,
        lastName,
        email,
        activeDirectoryUuid,
        phoneNumber,
        idNumber,
        newsletterSubscription,
        lastActiveAt,
        isActive: true,
        isActivated: true
      })

      const newAccount = await accountModel.createAccount({
        type
      })

      if (type === AccountType.Company) {
        await companyDetailsModel.createCompanyDetails({
          accountId: newAccount.id,
          companyIdentityNumber,
          incorporationName
        })
      }

      const newUserAccount = await userAccountModel.createUserAccount({
        userId: newUser.id,
        accountId: newAccount.id
      })

      return [newUser, newAccount, newUserAccount]
    } catch (error) {
      console.error('ERROR in users.helper createUserFromToken()', error.message)
      throw {
        message: `error while trying to createUserFromToken. error: ${error.message}`
      }
    }
  },

  updateUserFromToken: async (authInfo: AuthInfo): Promise<[IUser, IAccount, IUserAccount]> => {
    const firstName = authInfo.given_name
    const lastName = authInfo.family_name
    const email = authInfo.emails[0]
    const activeDirectoryUuid = authInfo.oid
    const newsletterSubscription = true
    const lastActiveAt = new Date()
    const type = authInfo.extension_companyBN ? AccountType.Company : AccountType.Private
    const idNumber = authInfo.extension_IDnumber
    const phoneNumber = authInfo.extension_phone
    const companyIdentityNumber = authInfo.extension_companyBN
    const incorporationName = authInfo.extension_companyname
    try {
      const newUser = await userModel.updateUser(
        {
          firstName,
          lastName,
          activeDirectoryUuid,
          email,
          idNumber,
          newsletterSubscription,
          lastActiveAt,
          isActive: true,
          isActivated: true
        },
        {
          phoneNumber
        }
      )

      const userAccount = await userAccountModel.getUserAccount({
        userId: newUser.id
      })

      if (!userAccount) {
        throw new Error(`No user account found for user ${newUser?.id}`)
      }

      const newAccount = await accountModel.updateAccount(
        {
          type
        },
        {
          id: userAccount?.account?.id
        }
      )

      if (!newAccount) {
        throw new Error(`No account found for user ${newUser?.id}`)
      }

      if (type === AccountType.Company) {
        await companyDetailsModel.createCompanyDetails({
          accountId: newAccount[0].id,
          companyIdentityNumber,
          incorporationName
        })
      }

      return [newUser, newAccount[0], userAccount]
    } catch (error) {
      console.error('ERROR in users.helper createUserFromToken()', error.message)
      throw {
        message: `error while trying to createUserFromToken. error: ${error.message}`
      }
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
        isActivated: false
      })

      const newAccount = await accountModel.createAccount({
        type: AccountType.Private
      })

      const newUserAccount = await userAccountModel.createUserAccount({
        userId: newUser.id,
        accountId: newAccount.id
      })

      return [newUser, newAccount, newUserAccount]
    } catch (error) {
      console.error('ERROR in users.helper createNotActivatedUser()', error.message)
      throw {
        message: `error while trying to createNotActivatedUser. error: ${error.message}`
      }
    }
  },

  createAdminUserFromADRespond: async (ADUser: any): Promise<IUser> => {
    try {
      const newUser = await userModel.createUser({
        firstName: ADUser.givenName,
        lastName: ADUser.surname,
        email: ADUser.mail,
        activeDirectoryUuid: ADUser.id,
        phoneNumber: ADUser.mobilePhone,
        newsletterSubscription: false,
        lastActiveAt: new Date(),
        isActive: true,
        role: UserRole.Admin
      })

      return newUser
    } catch (error) {
      console.error('ERROR in users.helper createAdminUserFromADRespond()', error.message)
      throw {
        message: `error while trying to createAdminUserFromADRespond. error: ${error.message}`
      }
    }
  }
}
export default usersHelper
