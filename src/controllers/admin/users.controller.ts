import { Request, Response } from 'express'
import { UserRole } from 'safe-shore-common'
import { Tables } from '../../constants'

import usersHelper from '../../helpers/users.helper'
import { userModel } from '../../models/index'
import { createAdminUserInB2C } from '../../services/activeDirectory.service'
import { failureResponse, successResponse } from '../../utils/db.utils'

export const getAllAdminUsers = async (req: Request, res: Response) => {
  try {
    const users = await userModel.getAllUsers({role:UserRole.Admin})
    res.status(200).json(successResponse(users))
  } catch (error: any) {
    res.status(500).json(failureResponse(error))
  }
}

export const getUserById = async (req: Request, res: Response) => {
  console.log('in controller getUserById')
  const { userId } = req.body
  if (!userId) res.status(400).json(failureResponse('missing Params'))
  try {
    const user = await userModel.getUserById(Number(userId))
    console.log(user)
    res.status(200).json(successResponse(user))
  } catch (error: any) {
    res.status(500).json(failureResponse(error))
  }
}

export const createAdminUser = async (req: Request, res: Response) => {
  console.log('in controller createAdminUser')
  const { firstName, lastName, email, phone } = req.body
  if (!firstName || !lastName || !email || !phone) res.status(400).json(failureResponse('missing Params'))
  try {
    const ADUser = await createAdminUserInB2C(firstName, lastName, email, phone)
    const user = await usersHelper.createAdminUserFromADRespond(ADUser)
    res.status(200).json(successResponse(user))
  } catch (error: any) {
    console.log(error)
    res.status(500).json(failureResponse(error))
  }
}
