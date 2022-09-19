import sgMail, { MailDataRequired } from '@sendgrid/mail'
import dotenv from 'dotenv'

dotenv.config()

const shouldSendEmail = process.env.NODE_ENV === 'prod' || process.env.NODE_ENV === 'staging'

const DEFAULT_MAIL_SENDER = 'no-reply@trustnet.com'

const start = (apiKey: string) => {
  sgMail.setApiKey(apiKey)
}

const sendEmail = async (msg: MailDataRequired) => {
  try {
    shouldSendEmail
      ? await sgMail.send({
          ...msg,
          from: msg.from || DEFAULT_MAIL_SENDER
        })
      : console.log(msg)
  } catch (error) {
    console.error(error)

    if (error.response) {
      console.error(error.response.body)
    }
  }
}

export default {
  sendEmail,
  start
}
