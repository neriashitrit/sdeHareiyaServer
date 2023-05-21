import { IUser } from './user'

declare global {
  namespace Express {
    type User = IUser
  }
}
