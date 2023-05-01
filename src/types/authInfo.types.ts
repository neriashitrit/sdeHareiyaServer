import { ITokenPayload } from 'passport-azure-ad';

export interface AuthInfo extends ITokenPayload {
  emails: string[];
  extension_newsletter_subsription: boolean;
  extension_account_type: 'private' | 'company';
  extension_phone_number: string;
  extension_id_number: number | null;
  extension_company_name: string | null;
  extension_company_id_number: number | null;
}
