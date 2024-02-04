import { Request, Response } from 'express'

import { EmailTemplateName, emailSubjectMapping } from '../constants'
import EmailService from '../services/email.service'
import globalHelper from '../helpers/global.helper'
// import globalHelper from 'helpers/global.helper'

export const healthCheck = (req: Request, res: Response) => {
  console.log('server is alive', new Date);
  
  return res.status(200).json({ status: 'success', body: 'server is alive' })
}

export const getErrorLog = (req: Request, res: Response) => {
  console.log('got error log ', new Date ,' ', req.body);
  return res.status(200).json({ status: 'success', body: 'server got the error' })
}

export const sendContactUs = async (req: Request, res: Response) => {
  const body = req.body


  const { firstName, lastName, phoneNumber, email, notes } = body

  await globalHelper.sendEmailTrigger(
    EmailTemplateName.CONTACT_US,
    [EmailService.defaultMailSender],
    emailSubjectMapping[EmailTemplateName.CONTACT_US],
    { firstName, lastName, phoneNumber, email, notes }
  )

  return res.status(200).json({ status: 'success', body: 'mail was sended successfully' })
}