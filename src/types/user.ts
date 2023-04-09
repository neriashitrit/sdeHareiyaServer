import { Gender } from './enums';
import { ITimestamps } from './timestamps';

export enum UserRole {
  User = 'user',
  Admin = 'admin',
  SuperAdmin = 'superAdmin',
}
export interface IUser extends ITimestamps {
  id: number;
  activeDirectoryUuid?: string;
  role?: UserRole;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  idNumber: number;
  idNumberCountryOfIssue: string;
  lastActiveAt?: Date;
  newsletterSubscription?: boolean;
  birthday: Date;
  gender: Gender;
}
