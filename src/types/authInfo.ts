export interface AuthInfo {
  exp: number; // Expiration time
  nbf: number; // Not before - identifies the time before which the JWT MUST NOT be accepted
  ver: string; // 1.0
  iss: string; // Issuer - identifies the principal that issued the JWT
  sub: string; // Subject - identifies the principal that is the subject of the JWT
  aud: string; // Audience - identifies the recipients that the JWT is intended for
  acr: string; // Authentication Context Class Reference
  nonce: string; // String value used to associate a Client session with an ID Token
  iat: number; // Issued at - claim identifies the time at which the JWT was issued
  auth_time: number; // Time when the End-User authentication occurred
  tid: string; // Tenant id
  name: string; // End-User's full name
  idp: string; // Identity provider
  oid: string;
  emails: string[];
  given_name: string;
  family_name: string;
  extension_newsletter_subsription: boolean;
  extension_account_type: 'private' | 'company';
  extension_phone_number: string;
  extension_id_number: number | null;
  extension_company_name: string | null;
  extension_company_id_number: number | null;
}
