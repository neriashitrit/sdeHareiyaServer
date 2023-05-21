import { Request, Response } from 'express';

import { commissionModel } from '../../models/index';

import _ from 'lodash';
import { failureResponse, successResponse } from '../../utils/db.utils';
import { isUpdateCommissionParams } from '../../utils/typeCheckers.utils';

export const updateCommission = async (req: Request, res: Response) => {
  try {
    if (!isUpdateCommissionParams(req.body)) {
      return res.status(400).json(failureResponse('Invalid Parameters'));
    }
    const { from, to, amount, type, id } = req.body
    const newCommission = await commissionModel.createCommission({
      from,
      to,
      amount,
      type,
      is_active:true,
      id
    });
    res.status(200).json(successResponse(newCommission))
	} catch (error: any) {
		console.log(error);
		res.status(500).json(failureResponse(error))
	}
};
