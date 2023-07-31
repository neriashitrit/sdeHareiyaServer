import { Request, Response } from 'express'
import { IUser } from 'safe-shore-common'
import { AuthInfo } from 'types'

import { EmailTemplateName, emailSubjectMapping } from '../constants'
import globalHelper from '../helpers/global.helper'
import usersHelper from '../helpers/users.helper'
import { userModel } from '../models/index'
import { failureResponse, successResponse } from '../utils/db.utils'
import { isUpdateUserBody } from '../utils/typeCheckers.utils'

const appUrl = process.env.APP_URL!

export const userLogin = async (req: Request, res: Response) => {
  const authInfo: AuthInfo = req?.authInfo as AuthInfo
  const user = req.user as IUser

  try {
    if (!user.id) {
      const [newUser] = await usersHelper.createUserFromToken(authInfo)

      globalHelper.sendEmailTrigger(
        EmailTemplateName.SIGN_UP_COMPLETED,
        [newUser.email],
        emailSubjectMapping[EmailTemplateName.SIGN_UP_COMPLETED],
        { link: `${appUrl}/private-area` }
      )

      return res.status(200).json(successResponse(newUser))
    }

    if (!user.isActivated) {
      const [updatedUser] = await usersHelper.updateUserFromToken(authInfo)

      globalHelper.sendEmailTrigger(
        EmailTemplateName.SIGN_UP_COMPLETED,
        [updatedUser.email],
        emailSubjectMapping[EmailTemplateName.SIGN_UP_COMPLETED],
        { link: `${appUrl}/private-area` }
      )

      return res.status(200).json(successResponse(updatedUser))
    }

    return res.status(200).json(successResponse(user))
  } catch (error) {
    console.error('ERROR in users.controller userLogin()', error.message)
    return res.status(400).send({ message: 'Something went wrong', error: error.message })
  }
}

export const getUser = (req: Request, res: Response) => {
  try {
    const user = req.user as IUser

    return res.status(200).json(successResponse(user))
  } catch (error) {
    return res.status(500).json(failureResponse(error))
  }
}

export const updateUser = async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser
    const body = req.body

    if (!isUpdateUserBody(body)) {
      return res.status(400).json(failureResponse('Invalid Parameters'))
    }

    const { firstName, lastName } = body

    const updatedUser = await userModel.updateUser({ firstName, lastName }, { id: user.id })

    globalHelper.sendEmailTrigger(
      EmailTemplateName.PROFILE_UPDATE,
      [updatedUser.email],
      emailSubjectMapping[EmailTemplateName.PROFILE_UPDATE],
      { link: `${appUrl}/private-area` }
    )

    return res.status(200).json(successResponse(updatedUser))
  } catch (error) {
    return res.status(500).json(failureResponse(error))
  }
}
