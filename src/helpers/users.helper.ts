import { AuthInfo, IUser } from 'types'
import UserModel from '../models/users.model'
import CompanyModel from '../models/companies.model'
import globalHelper from './global.helper'

const companyModel = new CompanyModel()
const userModel = new UserModel()

const usersHelper = {
  
    createUser: async (authInfo: AuthInfo):Promise<IUser> => {  
        const schemaName =  globalHelper.getSchemaName(authInfo)
        const position =  globalHelper.getPosition(authInfo)
        const first_name =  authInfo.given_name
        const user_name =  authInfo.name
        const last_name =  authInfo.family_name
        const email =  authInfo.emails[0]
        try {
            const company = await companyModel.getCompany(schemaName)
            const company_id =  company.id
            const user:IUser = {company_id, first_name, last_name, user_name, email, position}
            const newUser = await userModel.createUser(user)
            return newUser
        } catch (error) {
            console.error('ERROR in companies.controller createCompany()', error.message);
            throw(`error while trying to create user ${first_name} ${last_name} from ${schemaName} company`)
        }
    },

} 
export default usersHelper