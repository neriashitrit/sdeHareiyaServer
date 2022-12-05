import { AuthInfo, IUser } from 'types'
import UserModel from '../models/users.model'
import globalHelper from './global.helper'

const userModel = new UserModel()

const usersHelper = {
  
    createUser: async (authInfo: AuthInfo):Promise<IUser> => {  
        const first_name =  authInfo.given_name
        const user_name =  authInfo.name
        const last_name =  authInfo.family_name
        const email =  authInfo.emails[0]
        try {
            const user:IUser = {first_name, last_name, user_name, email}
            const newUser = await userModel.createUser(user)
            return newUser
        } catch (error) {
            console.error('ERROR in users.helper createUser()', error.message);
            throw({message:`error while trying to create user ${first_name} ${last_name}. error: ${error.message}`})
        }
    },

} 
export default usersHelper