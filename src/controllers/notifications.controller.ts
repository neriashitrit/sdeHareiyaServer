import { Request, Response } from 'express'
import globalHelper from '../helpers/global.helper'
import { toInteger } from 'lodash';
import { AuthInfo } from 'types';

import NotificationModel from '../models/notifications.model'

const notificationModel = new NotificationModel()

export const getRecentNotifications = async (req: Request, res: Response) => {
  console.log('in controller getRecentNotifications');
  const authInfo:AuthInfo = req?.authInfo as AuthInfo
  const schemaName =  globalHelper.getSchemaName(authInfo)
  const howMany = toInteger(req?.query?.howMany)

  try {
    if (typeof(howMany) !== 'number'){throw 'send the number of the notification you want'}
    const notifications = await notificationModel.getNotification(schemaName)
    return res.status(200).send(notifications.slice(0,howMany))
  } catch (error) {
    console.error('ERROR in notifications.controller getNotification()', error);
    return res.status(400).send({message:'Something went wrong', error:error})
  }
}
