import { Request, Response } from 'express';
import { AuthInfo } from 'types';
import globalHelper from '../helpers/global.helper';

import { globalModel } from '../models/index';
import FileService from '../services/storage.service';
import DbService from 'services/db.service';
import { successResponse } from 'utils/db.utils';

const fileService = FileService.getInstance();

export const healthCheck = async (req: Request, res: Response) => {
  return res.status(200).json(successResponse({ server: 'alive' }));
};
