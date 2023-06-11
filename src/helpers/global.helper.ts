import path from 'path'
import pug from 'pug'

import { EmailTemplateName } from '../constants'
import EmailService from '../services/email.service'

const emailService = EmailService.getInstance()

const globalHelper = {
  sendEmailTrigger: async (
    templateName: EmailTemplateName,
    emails: string[],
    subject: string,
    params?: Record<string, any>
  ) => {
    try {
      const templateFile = `${path.dirname(__dirname)}/templates/${templateName}.pug`
      const emailContent = pug.renderFile(templateFile, params ?? {})

      for (const email of emails) {
        await emailService.sendEmail({
          email,
          subject,
          html: emailContent
        })
      }
    } catch (error: unknown) {
      console.log(`couldnt send en email to ${emails} subject ${subject} ,error`, error)
    }
  }
}

export default globalHelper
