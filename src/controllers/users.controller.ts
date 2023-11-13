import { Request, Response } from 'express'

import { EmailTemplateName, emailSubjectMapping } from '../constants'
import globalHelper from '../helpers/global.helper'
import usersHelper from '../helpers/users.helper'

const appUrl = process.env.APP_URL!


export const getUser = (req: Request, res: Response) => {
  // try {
  //   const user = req.user as IUser

  //   return res.status(200).json(successResponse(user))
  // } catch (error) {
  //   return res.status(500).json(failureResponse(error))
  // }
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
