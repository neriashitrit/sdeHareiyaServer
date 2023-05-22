import { Request, Response } from 'express'
import { IUser } from 'safe-shore-common'
import { AuthInfo } from 'types'

import usersHelper from '../helpers/users.helper'
import { userModel } from '../models/index'
import { failureResponse, successResponse } from '../utils/db.utils'
import { isUpdateUserBody } from '../utils/typeCheckers.utils'

export const userLogin = async (req: Request, res: Response) => {
  const authInfo: AuthInfo = req?.authInfo as AuthInfo
  const userMail = authInfo.emails[0]

  try {
    const user = await userModel.getUser(userMail)
    if (!user) {
      const [newUserAccount] = await usersHelper.createUserFromToken(authInfo)
      return res.status(200).json(successResponse(newUserAccount))
    }

    if (!user.isActivated) {
      const [updatedUserAccount] = await usersHelper.updateUserFromToken(authInfo)
      return res.status(200).json(successResponse(updatedUserAccount))
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

    return res.status(200).json(successResponse(updatedUser))
  } catch (error) {
    return res.status(500).json(failureResponse(error))
  }
}
