import { Request, Response } from 'express'

import GlobalModel from '../models/global.model'
import  FileService  from '../services/storage.service'

const globalModel = new GlobalModel()
const fileService = FileService.getInstance()

export const uploadAvatar =  async (req: Request, res: Response) => {
  console.log('in controller uploadAvatar');
  const {avatarType, id, randomCode}= req.body
  const {files}:any  = req
  const {avatarImage} = files
  // TODO add avatar to DB
  try {
    fileService.insert(avatarImage, randomCode, avatarType)
    return res.status(200).send({status:'file uploaded'} )
  } catch (error) {
    console.error('ERROR in global.controller uploadAvatar()', error.message);
    return res.status(400).send({message:'Something went wrong', error:error.message})
  }
}

export const getAvatar =  async (req: Request, res: Response) => {
  console.log('in controller getAvatar');
  try {
    const avatar = await fileService.fetch('2ef0c9f8-efed-4b96-8345-2c3cea42c8f7', 'users')
    
    return res.status(200).send({status:'found avatar ', avatar:avatar} )
  } catch (error) {
    console.error('ERROR in global.controller getAvatar()', error.message);
    return res.status(400).send({message:'Something went wrong', error:error.message})
  }
}