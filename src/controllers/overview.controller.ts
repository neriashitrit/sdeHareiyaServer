import { Request, Response } from 'express'

import AjaxService from '../services/ajax.service'

const instance = AjaxService.getInstance()

export const getOverviewTotalSubsData = async (req: Request, res: Response) => {
  const { id: tenantId } = req.params

  try {
    const response = await instance.get(`/customers/${tenantId}/subscriptions`)
    const expired = response.data?.items?.reduce(
      (sum: number, curValue: any) => (curValue.status === 'expired' ? sum + 1 : sum),
      0
    )

    const data = {
      totalCount: response.data.totalCount,
      expiredCount: expired
    }

    return res.status(200).send(data)
  } catch (error) {
    return res.status(400).send('Something went wrong')
  }
}
