import { ITimestamps } from './timestamps';

export interface ICompanyContact {
  fullName: string;
  idNumber: string;
}

export enum FundsSource {
  PropertySale = 'propertySale',
  BusinessIncome = 'businessIncome',
  YieldingRealEstate = 'yieldingRealEstate',
  OtherInvestments = 'otherInvestments',
  Other = 'other',
}

export interface ICompanyDetails extends ITimestamps {
  id: number;
  companyIdentityNumber: number;
  incorporationName: string;
  incorporationDate: Date;
  fundsSource: FundsSource;
  fundsSourceOther: string;
  contacts: ICompanyContact[];
}
