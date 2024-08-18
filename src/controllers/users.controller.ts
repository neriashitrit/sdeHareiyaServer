import { Request, Response } from 'express'

import { userModel } from '../models/users.model'

export const createUser = async (req: Request, res: Response) => {
  try {
    const {firstName,
      lastName,
      idNumber,
      address,
      email,
      phoneSms,
      phoneWhatsApp,
      goodOpinion,
      badOpinion,
      getMessages} = req.body
    if (!firstName || 
      !lastName || 
      !idNumber || 
      !email || 
      (!phoneSms && !phoneWhatsApp) || 
      !getMessages) {return res.status(400).json({ status: 'failed', body: 'missing params' })}
    const createdUser = await userModel.createUser({firstName, lastName, idNumber, address, email, 
      phoneSms, phoneWhatsApp, goodOpinion, badOpinion, getMessages})
    return res.status(200).json((createdUser))
  } catch (error) {
    console.log('error in users controller ', error)
    if(error.error.errorCode == 4011) return res.status(401).json((error.error))
    return res.status(500).json((error))
  }
}
