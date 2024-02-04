import _ from 'lodash'

import { Tables } from '../constants'
import DbService from '../services/db.service'

const db = new DbService()

export const userModel = {
  getAllUsers: async (condition: Record<string, any> = {}): Promise<IUser[]> => {
    try {
      const users = await db.getAll(Tables.USERS, { is_active: true, ...condition })
      return users
    } catch (error) {
      console.error('ERROR in users.modal getAllUsers()', error.message)
      throw {
        message: `error while trying to getAllUser. error: ${error.message}`
      }
    }
  },
  getUserById: async (id: number): Promise<IUser> => {
    try {
      const user = await db.getOneById(Tables.USERS, id)
      return user
    } catch (error) {
      console.error('ERROR in users.modal getUser()', error.message)
      throw {
        message: `error while trying to getUser. error: ${error.message}`
      }
    }
  },
  getUser: async (activeDirectoryUuid: string, phoneNumber?: string): Promise<IUser> => {
    const lastActiveAt = new Date()
    try {
      const user = await db.update(
        Tables.USERS,
        { lastActiveAt },
        phoneNumber ? { phoneNumber } : { activeDirectoryUuid }
      )
      return user?.[0]
    } catch (error) {
      console.error('ERROR in users.modal getUser()', error.message)
      throw {
        message: `error while trying to getUser. error: ${error.message}`
      }
    }
  },
  createUser: async (newUser: Record<string, any>): Promise<IUser> => {
    try {
      const existUser = await db.getOne(Tables.USERS,{id_number:newUser.idNumber})
      if (existUser) {
        throw {
          message: `user already exist`
        }
      }
      const dbUser = {sms_phone:newUser.phoneSms, first_name:newUser.firstName, last_name:newUser.lastName, id_number:newUser.idNumber,
                     address:newUser.address, email:newUser.email, whatsapp_phone:newUser.phoneWhatsApp, good_feedback:newUser.goodOpinion,
                     bad_feedback:newUser.badOpinion, advertising_confirmation:newUser.getMessages}
      const user = await db.insert(Tables.USERS, dbUser)

      return user?.[0]
    } catch (error) {
      console.error('ERROR in users.modal createUser()', error.message)
      throw {
        message: `error while trying to createUser. error: ${error.message}`
      }
    }
  },
  updateUser: async (updatedUser: Record<string, any>, condition: Record<string, any> | string): Promise<IUser> => {
    try {
      console.log(updatedUser)
      const users = await db.update(Tables.USERS, updatedUser, condition)
      return users?.[0]
    } catch (error) {
      console.error('ERROR in users.modal updateUser()', error.message)
      throw {
        message: `error while trying to updateUser. error: ${error.message}`
      }
    }
  }
}
