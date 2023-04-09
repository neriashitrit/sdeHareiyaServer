import { IBankDetails } from './bankDetails';
import { ICompanyDetails } from './companyDetails';
import { IFile } from './file';
import { ITimestamps } from './timestamps';
import { IUser } from './user';

export enum AutharizationStatus {
  NotAuthorized = 'notAuthorized',
  Pending = 'pending',
  Authorized = 'authorized',
  Blocked = 'blocked',
}

export enum AccountType {
  Company = 'company',
  Private = 'private',
}
export interface IAccount extends ITimestamps {
  id: number;
  type: AccountType;
  autharizationStatus: AutharizationStatus;
  occupation?: string;
  postalCode?: number;
  country?: string;
  city?: string;
  streetName?: string;
  houseNumber?: string;
  apartmentNumber?: string;
  isThirdParty?: boolean;
  isThirdPartyFullName?: string;
  isBankAccountBlocked?: boolean;
  users: IUser[];
  bankDetails?: IBankDetails;
  companyDetails?: ICompanyDetails;
  files?: IFile[];
}
