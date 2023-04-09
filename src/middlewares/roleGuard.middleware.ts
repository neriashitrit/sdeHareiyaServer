import { NextFunction, Response } from 'express';
import _ from 'lodash';

export const roleGuard =
  () => async (req: any, res: Response, next: NextFunction) => {
    // try {
    //   const email = req.authInfo.emails[0] || ''
    //   if (!email) {
    //     return res.status(401).send({ success: false, message: 'Unauthorized by roleGuard' })
    //   }
    //   if (req.authInfo.jobTitle.includes('trustnet')){
    //     req.userRole = UserRole.ADMIN
    //   }
    //   else{
    //     req.userRole = UserRole.USER
    //   }

    //   const {companyName}= req?.query
    //   if (req.userRole = UserRole.ADMIN && companyName){
    //     if ( companyName=='trustnet'){
    //       return res.status(400).send({ success: false, message: 'can not change to trustnet company' })
    //     }
    //   const jobTitle = changeAdminCompany(req.authInfo.jobTitle, companyName)
    //   req.authInfo.jobTitle = jobTitle
    //   }
    //   return next()
    // } catch (error) {
    //   return res.status(400).send({ success: false, message: 'error in role guard', error: error.message })
    // }
    next();
  };
