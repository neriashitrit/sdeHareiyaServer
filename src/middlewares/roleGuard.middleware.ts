import { NextFunction, Request, Response } from 'express'
import { IUser, UserRole } from 'safe-shore-common'

export const roleGuard = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user as IUser

      if (!allowedRoles.includes(user.role) && req.url !== '/user/login') {
        return res.status(401).send({ success: false, message: 'unauthorized user' })
      }

      req.locals.user = user

      return next()
    } catch (error) {
      return res.status(400).send({ success: false, message: 'error in role guard', error: error.message })
    }
  }
}
