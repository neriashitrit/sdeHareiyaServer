import _ from 'lodash'

import { Tables } from '../constants'
import DbService from '../services/db.service'

const db = new DbService()

export const userModel = {
  getAllUsers: async (condition: Record<string, any> = {}): Promise<IUser[]> => {
    try {
      const users = await db.getAll(Tables.USERS, {...condition })
      return users
    } catch (error) {
      console.error('ERROR in users.modal getAllUsers()', error.message)
      throw {
        message: `error while trying to getAllUser. error: ${error.message}`
      }
    }
  },
  createUser: async (newUser: Record<string, any>): Promise<IUser> => {
    try {
      const existUser = await db.getOne(Tables.USERS,{id_number:newUser.idNumber})
      if (existUser) {
        throw {
          message: `user already exist`,
          errorCode:4011
        }
      }
      const dbUser = {sms_phone:newUser.phoneSms, first_name:newUser.firstName, last_name:newUser.lastName, id_number:newUser.idNumber,
                     address:newUser.address, email:newUser.email, whatsapp_phone:newUser.phoneWhatsApp, good_feedback:newUser.goodOpinion,
                     bad_feedback:newUser.badOpinion, advertising_confirmation:newUser.getMessages}
      const user = await db.insert(Tables.USERS, dbUser)

      return user?.[0]
    } catch (error) {
      console.error('ERROR in users.modal createUser()', error)
      throw {
        error
      }
    }
  },
}
