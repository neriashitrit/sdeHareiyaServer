import { Request, Response } from 'express'
import { IUser } from 'safe-shore-common'

import { fileModel } from '../models/index'
import { generateRandomPassword } from '../services/auth.service'
import FileService from '../services/storage.service'
import { successResponse } from '../utils/db.utils'

const fileService = FileService.getInstance()

export const healthCheck = (req: Request, res: Response) => {
  return res.status(200).json(successResponse({ server: 'alive' }))
}

export const uploadFileToStorage = async (req: Request, res: Response) => {
  const { files }: any = req
  const { file } = files
  const userMail = (req.user as IUser).email
  const random = generateRandomPassword(32, true, true, true, true)
  try {
    const url = await fileService.insert(file, userMail, random)
    const newFile = await fileModel.createFile({ url })
    return res.status(200).send({ status: 'file uploaded', FileUrl: newFile })
  } catch (error) {
    console.error('ERROR in global.controller uploadFileToStorage()', error.message)
    return res.status(400).send({ message: 'Something went wrong', error: error.message })
  }
}

export const getSas = async (req: Request, res: Response) => {
  try {
    const sas = await fileService.getSas()
    return res.status(200).send({ status: 'sas acquired', sas: sas })
  } catch (error) {
    console.error('ERROR in global.controller getSas()', error.message)
    return res.status(400).send({ message: 'Something went wrong', error: error.message })
  }
}
