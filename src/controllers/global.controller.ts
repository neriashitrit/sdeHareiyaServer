import { Request, Response } from 'express';

import FileService from '../services/storage.service';
import { successResponse } from '../utils/db.utils';

// const fileService = FileService.getInstance();

export const healthCheck = async (req: Request, res: Response) => {
  return res.status(200).json(successResponse({ server: 'alive' }));
};
