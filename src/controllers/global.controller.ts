import { Request, Response } from 'express'
import { IUser } from 'safe-shore-common'

import { fileModel } from '../models/index'
import { generateRandomPassword } from '../services/auth.service'
import EmailService from '../services/email.service'
import FileService from '../services/storage.service'
import { failureResponse, successResponse } from '../utils/db.utils'
import { buildEmailBody } from '../utils/global.utils'
import { isSendContactUsBody } from '../utils/typeCheckers.utils'

const fileService = FileService.getInstance()
const emailService = EmailService.getInstance()

export const healthCheck = (req: Request, res: Response) => {
  return res.status(200).json(successResponse({ server: 'alive' }))
}

export const sendContactUs = async (req: Request, res: Response) => {
  const body = req.body

  if (!isSendContactUsBody(body)) {
    return res.status(400).json(failureResponse('Invalid Parameters'))
  }

  const { firstName, lastName, phoneNumber, email, notes } = body

  await emailService.sendEmail({
    to: 'danielr@one-digital.co.il',
    from: EmailService.defaultMailSender,
    text: buildEmailBody('contactUs', { firstName, lastName, email, phoneNumber, notes })
  })
  return res.status(200).json(successResponse())
}

export const uploadFileToStorage = async (req: Request, res: Response) => {
  const { files }: any = req
  const { file } = files
  const userMail = (req.user as IUser).email
  const random = generateRandomPassword(32, true, false, true, true)
  try {
    const url = await fileService.insert(file, userMail, random)
    await fileModel.createFile({ url })
    return res.status(200).send({ status: 'file uploaded', url })
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
