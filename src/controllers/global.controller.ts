import { Request, Response } from 'express'
import { AuthInfo } from 'types'
import globalHelper from '../helpers/global.helper'

import GlobalModel from '../models/global.model'
import  FileService  from '../services/storage.service'

const fileService = FileService.getInstance()

export const uploadAvatar =  async (req: Request, res: Response) => {
  console.log('in controller uploadAvatar');
  const authInfo:AuthInfo = req?.authInfo as AuthInfo
  const {avatarType, id, randomCode}= req.body
  const {files}:any  = req
  const {avatarImage} = files
  try {
    const ImageUrl = await fileService.insert(avatarImage, randomCode, avatarType)
    const newImage = await globalHelper.createImage(avatarType, randomCode, authInfo, id, ImageUrl)
    return res.status(200).send({status:'file uploaded', newImage:newImage} )
  } catch (error) {
    console.error('ERROR in global.controller uploadAvatar()', error.message);
    return res.status(400).send({message:'Something went wrong', error:error.message})
  }
}

export const getAvatar =  async (req: Request, res: Response) => {
  console.log('in controller getAvatar');
  const authInfo:AuthInfo = req?.authInfo as AuthInfo
  const {avatarType, id}:any= req.query
  try {
    const Image = await globalHelper.getImage(avatarType, authInfo, id)
    return res.status(200).send({status:'found avatar ', avatar:Image} )
  } catch (error) {
    console.error('ERROR in global.controller getAvatar()', error.message);
    return res.status(400).send({message:'Something went wrong', error:error.message})
  }
}

export const getSAS =  async (req: Request, res: Response) => {
  console.log('in controller getSAS');
  try {
    const SAS  = fileService.getSas()
    return res.status(200).send(SAS)
  } catch (error) {
    console.error('ERROR in global.controller getSAS()', error.message);
    return res.status(400).send({message:'Something went wrong', error:error.message})
  }
}