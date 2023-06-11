/* eslint-disable @typescript-eslint/naming-convention */
import { IUser } from 'safe-shore-common'

declare global {
  namespace Express {
    interface Locals {
      user?: IUser
    }
    interface Request {
      locals: Locals
    }
  }
}
