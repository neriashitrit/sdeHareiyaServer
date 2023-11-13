import { Request, Response } from 'express'

import { EmailTemplateName, emailSubjectMapping } from '../constants'
import EmailService from '../services/email.service'

export const healthCheck = (req: Request, res: Response) => {
  return res.status(200).json(successResponse({ server: 'alive' }))
}

export const sendContactUs = async (req: Request, res: Response) => {
  const body = req.body

  if (!isSendContactUsBody(body)) {
    return res.status(400).json(failureResponse('Invalid Parameters'))
  }

  const { firstName, lastName, phoneNumber, email, notes } = body

  await globalHelper.sendEmailTrigger(
    EmailTemplateName.CONTACT_US,
    [EmailService.defaultMailSender],
    emailSubjectMapping[EmailTemplateName.CONTACT_US],
    { firstName, lastName, phoneNumber, email, notes }
  )

  return res.status(200).json(successResponse())
}