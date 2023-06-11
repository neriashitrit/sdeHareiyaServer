import { ITokenPayload } from 'passport-azure-ad'

export interface IAuthInfo extends ITokenPayload {
  emails: string[]
  extension_ads: boolean
  extension_companyBN: string
  extension_companyname: string
  extension_phone?: string
  extension_IDnumber: number | null
}
