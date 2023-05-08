import { Request, Response } from 'express';

import {
  commissionModel,
} from '../models/index';

import _ from 'lodash';
import { failureResponse, successResponse } from '../utils/response';

export const getActiveCommissions = async (req: Request, res: Response) => {
  console.log('in controller getActiveCommissions')
  try {
    const commissions = await commissionModel.getCommissions({
      isActive: true,
    });  
    res.status(201).json(successResponse(commissions))
	} catch (error: any) {
		console.log(error);
		res.status(500).json(failureResponse(error))
	}
};