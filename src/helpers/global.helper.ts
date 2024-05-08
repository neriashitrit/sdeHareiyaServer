import path from 'path'
import pug from 'pug'

import { EmailTemplateName, Tables } from '../constants'
import EmailService from '../services/email.service'
import DbService from '../services/db.service'

const db = new DbService()

const emailService = EmailService.getInstance()
const globalHelper = {
  isAuthenticated:async (
    userName: string,
    password: string,
    table: Tables
  ) : Promise<boolean> => {
  try {
    const user = await db.getOne(
      table,
      {user_name:userName.toLowerCase().trim()},
    )
    return user.password.toLowerCase().trim()===password.toLowerCase().trim()
  } catch (error) {
    console.log('error in globalHelper.isAuthenticated ', error)
    return false
  }
},


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
      console.log(`couldn't send en email to ${emails} subject ${subject} ,error`, error)
    }
  }
}

export default globalHelper
