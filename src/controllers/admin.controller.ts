import { Request, Response } from 'express'

import { userModel } from '../models/users.model'
import { Tables } from '../constants'
import globalHelper from '../helpers/global.helper'
import _ from 'lodash'
export const getUsers = async (req: Request, res: Response) => {
  try {
    const {userName, password} = req.query
    if (!userName || !password ) {return res.status(400).json({ status: 'failed', body: 'missing params' })}
    const isAuthenticated = await globalHelper.isAuthenticated(userName as string, password as string, Tables.ADMIN)
    if (!isAuthenticated) { res.status(401).json(('user is not authenticated. log out and log in'))}
    const allUsers = await userModel.getAllUsers()
    return res.status(200).json(allUsers)
  } catch (error) {
    console.log('error in users controller ', error)
    return res.status(500).json((error))
  }
}


export const login = async (req: Request, res: Response) => {
  try {
    const { userName, password} = req.body
    if (!userName || !password ) {return res.status(400).json({ status: 'failed', body: 'missing params' })}
    const isAuthenticated = await globalHelper.isAuthenticated(userName, password, Tables.ADMIN)
    return isAuthenticated ? res.status(200).json((true)) : res.status(401).json((false))
  } catch (error) {
    console.log('error in users controller ', error)
    return res.status(500).json((error))
  }
}