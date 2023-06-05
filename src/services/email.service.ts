import sgMail, { MailDataRequired } from '@sendgrid/mail'
import { convert } from 'html-to-text'

export default class EmailService {
  static instance: EmailService

  static defaultMailSender = process.env.SENDGRID_DEFAULT_SENDER!
  static shouldSendEmail = true //process.env.NODE_ENV === 'prod' || process.env.NODE_ENV === 'staging'

  constructor() {
    if (EmailService.instance) {
      return EmailService.instance
    }
    sgMail.setApiKey(process.env.SENDGRID_API_KEY || '')
    EmailService.instance = this
  }

  static getInstance = () => EmailService.instance || new EmailService()

  sendEmail = async ({
    email,
    subject,
    html,
    from,
    text
  }: {
    email: string | string[]
    subject: string
    html: string
    from?: string
    text?: string
  }): Promise<any> => {
    try {
      const msg = text || convert(html)
      if (Array.isArray(email)) {
        console.log(`Sending ${email.join(', ')} subject "${subject}"`)
      } else {
        console.log(`Sending ${email} subject "${subject}"`)
      }
      return await sgMail.send({
        from: from || EmailService.defaultMailSender,
        to: email,
        subject,
        text: msg,
        html
      })
    } catch (error) {
      console.log(error.response?.body)
      return Promise.reject({ code: 500, message: "can't send email" })
    }
  }
}
