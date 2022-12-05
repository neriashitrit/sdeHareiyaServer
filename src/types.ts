
export interface IUser {
  id?: number
  first_name: string
  last_name: string
  user_name: string
  email:string
  active?:boolean
  createdAt?: Date
  updatedAt?: Date
}
export interface AuthInfo {
  exp: number // Expiration time
  nbf: number // Not before - identifies the time before which the JWT MUST NOT be accepted
  ver: string // 1.0
  iss: string // Issuer - identifies the principal that issued the JWT
  sub: string // Subject - identifies the principal that is the subject of the JWT
  aud: string // Audience - identifies the recipients that the JWT is intended for
  acr: string // Authentication Context Class Reference
  nonce: string // String value used to associate a Client session with an ID Token
  iat: number // Issued at - claim identifies the time at which the JWT was issued
  auth_time: number // Time when the End-User authentication occurred
  tid: string // Tenant id
  name: string // End-User's full name
  idp: string // Identity provider
  emails: string[]
  given_name: string
  family_name: string
  jobTitle: string
}