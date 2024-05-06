import { Request, Response } from 'express'

import { EmailTemplateName, emailSubjectMapping } from '../constants'
import globalHelper from '../helpers/global.helper'
import usersHelper from '../helpers/users.helper'
import { userModel } from '../models/users.model'

const appUrl = process.env.APP_URL!


export const getUser = async (req: Request, res: Response) => {
  // try {
  //   const user = await userModel.getUser()
  //   return res.status(200).json((user))
  // } catch (error) {
  //   return res.status(500).json((error))
  // }
}

export const createUser = async (req: Request, res: Response) => {
  try {
    const {firstName,
      lastName,
      idNumber,
      address,
      email,
      phoneSms,
      phoneWhatsApp,
      goodOpinion,
      badOpinion,
      getMessages} = req.body
    if (!firstName || 
      !lastName || 
      !address || 
      !email || 
      (!phoneSms && !phoneWhatsApp) || 
      !getMessages) {return res.status(400).json({ status: 'failed', body: 'missing params' })}
    const createdUser = await userModel.createUser({firstName, lastName, idNumber, address, email, 
      phoneSms, phoneWhatsApp, goodOpinion, badOpinion, getMessages})
    return res.status(200).json((createdUser))
  } catch (error) {
    console.log('in contriker user ', error)
    if(error.error.errorCode == 4011) return res.status(401).json((error.error.errorCode))
    return res.status(500).json((error))
  }
}

export const updateUser = async (req: Request, res: Response) => {
  // try {
  //   const user = req.user as IUser
  //   const body = req.body

  //   if (!isUpdateUserBody(body)) {
  //     return res.status(400).json(failureResponse('Invalid Parameters'))
  //   }

  //   const { firstName, lastName } = body

  //   const updatedUser = await userModel.updateUser({ firstName, lastName }, { id: user.id })

  //   globalHelper.sendEmailTrigger(
  //     EmailTemplateName.PROFILE_UPDATE,
  //     [updatedUser.email],
  //     emailSubjectMapping[EmailTemplateName.PROFILE_UPDATE],
  //     { link: `${appUrl}/private-area` }
  //   )

  //   return res.status(200).json(successResponse(updatedUser))
  // } catch (error) {
  //   return res.status(500).json(failureResponse(error))
  // }
}
