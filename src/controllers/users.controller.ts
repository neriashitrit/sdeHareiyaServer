import { Request, Response } from 'express'

import UserModel from '../models/users.model'
import { AuthInfo } from 'types';
import usersHelper from '../helpers/users.helper';

const userModel = new UserModel()

export const userLogin =  async (req: Request, res: Response) => {
  console.log('in controller userLogin');
  const authInfo:AuthInfo = req?.authInfo as AuthInfo
  try {
    const user  = await userModel.getUser(authInfo.emails[0])
    if (!user){
      const newUser = await usersHelper.createUser(authInfo)
      return res.status(200).send({status:`user ${authInfo.given_name} added successfully`,user:newUser})
    }
    else return res.status(200).send({status:`found user ${user}`,user:user} )
  } catch (error) {
    console.error('ERROR in users.controller userLogin()', error.message);
    return res.status(400).send({message:'Something went wrong', error:error.message})
  }
}
