import { NextFunction, Response } from 'express'
import _ from 'lodash'


export const roleGuard = () =>
  async (req: any, res: Response, next: NextFunction) => {
    console.log('roleGuard');

    const { email } = req.authInfo.emails[0] || ''
    if (!email) {
      return res.status(401).send({ success: false, message: 'Unauthorized by roleGuard' })
    }
    try {
      console.log('in try');
      req.authInfo.neria = 'neria'
      // const user = await userHelper.getUserByEmail(email.toLowerCase())
      // attach user and pass to controller
      // res.locals.user = user

      // if (_.isEmpty(user)) {
      //   return res.status(401).send({ success: false, message: 'Unauthorized by roleGuard' })
      // }

    } catch (error) {
      console.log('in catch');
      
      return res.status(500).send({ success: false })
    }
    // authentication and authorization successful
    return next()
  }
