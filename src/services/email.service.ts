import sgMail, { MailDataRequired } from '@sendgrid/mail'

export default class EmailService {
  static instance: EmailService

  static defaultMailSender = 'guyd@spectory.com' //'no-reply@safeShore.com'
  static shouldSendEmail = true //process.env.NODE_ENV === 'prod' || process.env.NODE_ENV === 'staging'

  constructor() {
    if (EmailService.instance) {
      return EmailService.instance
    }
    sgMail.setApiKey(process.env.SENDGRID_API_KEY || '')
    EmailService.instance = this
  }

  static getInstance = () => EmailService.instance || new EmailService()

  sendEmail = async (msg: MailDataRequired) => {
    try {
      await sgMail.send({
        ...msg,
        subject: 'subject',
        from: msg.from || EmailService.defaultMailSender
      })
    } catch (error) {
      throw `cant send email error: ${error}`
    }
  }
}
