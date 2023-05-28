import { ITokenPayload } from 'passport-azure-ad'

export interface IAuthInfo extends ITokenPayload {
  emails: string[]
  extension_newsletter_subscription: boolean
  extension_account_type: 'private' | 'company'
  extension_phone: string
  extension_role: string
  extension_IDnumber: number | null
  extension_company_name: string | null
  extension_company_id_number: number | null
}
