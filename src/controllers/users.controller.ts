import { Request, Response } from 'express';

import { userModel, accountModel, userAccountModel } from '../models/index';

import { AuthInfo } from 'types';
import usersHelper from '../helpers/users.helper';
import { successResponse } from '../utils/response';

export const userLogin = async (req: Request, res: Response) => {
  //  TODO make it as transaction structure
  console.log('in controller userLogin');
  const authInfo: AuthInfo = req?.authInfo as AuthInfo;
  const userMail = authInfo.emails[0];
  const accountType = authInfo.extension_account_type ?? 'private';

  try {
    const user = await userModel.getUser(userMail);
    if (!user) {
      const newUser = await usersHelper.createUser(authInfo);
      const newAccount = await accountModel.createAccount({
        type: accountType,
      });
      const newUserAccount = await userAccountModel.createUserAccount({
        userId: newUser.id,
        accountId: newAccount.id,
      });

      return res.status(200).json(successResponse(newUser));
    } else return res.status(200).json(successResponse(user));
  } catch (error) {
    console.error('ERROR in users.controller userLogin()', error.message);
    return res
      .status(400)
      .send({ message: 'Something went wrong', error: error.message });
  }
};

// export const getUser =  async (req: Request, res: Response) => {
//   console.log('in controller getUser');
//   const authInfo:AuthInfo = req?.authInfo as AuthInfo
//   const userMail = authInfo.emails[0]
//   try {
//     const user  = await userModel.getUser(userMail)
//     if (!user){
//       return res.status(400).send({message:'Something went wrong', error:`couldn't find this user ${userMail} `})
//     }
//     else {
//       const companyName =  globalHelper.getSchemaName(authInfo)
//       const userWithCompany = {...user, ...{companyName:companyName}};
//       return res.status(200).send({status:`user found`, user:userWithCompany} )}
//   } catch (error) {
//     console.error('ERROR in users.controller getUser()', error.message);
//     return res.status(400).send({message:'Something went wrong', error:error.message})
//   }
// }
// export const getAllCompanyUsers =  async (req: Request, res: Response) => {
//   console.log('in controller getAllCompanyUsers');
//   const authInfo:AuthInfo = req?.authInfo as AuthInfo
//   const schemaName =  globalHelper.getSchemaName(authInfo)
//   try {
//     const users  = await usersHelper.getAllCompanyUsers(schemaName)
//     return res.status(200).send({status:'found company users', users:users} )
//   } catch (error) {
//     console.error('ERROR in users.controller getAllCompanyUsers()', error.message);
//     return res.status(400).send({message:'Something went wrong', error:error.message})
//   }
// }
// export const sendContactUs =  async (req: Request, res: Response) => {
//   console.log('in controller sendContactUs');
//   const {user, title, description} = req.body
//   try {
//     await emailService.sendEmail({
//       to: 'CSM@trustnet.co.il',
//       from: user.email,
//       subject:title,
//       text:description,
//     })
//         return res.status(200).send({status:'mail sended successfully'} )
//   } catch (error) {
//     console.error('ERROR in users.controller sendContactUs()', error.message);
//     return res.status(400).send({message:'Something went wrong', error:error.message})
//   }
// }
