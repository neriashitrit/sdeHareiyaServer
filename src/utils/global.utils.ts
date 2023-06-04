import { CommissionType, ICommission } from 'safe-shore-common'

import { emailTemplates } from '../constants'
import { EmailTemplateName } from '../constants'

export const commissionCalculate = (
  commissions: ICommission[],
  amount: number
): { commissionId: number | null; amount: number } => {
  const currentCommission = commissions.find(
    (commission) => amount >= commission.from && (commission.to === undefined || amount <= commission.to)
  )

  if (currentCommission === undefined) {
    return { commissionId: null, amount: 0 }
  }

  return {
    commissionId: currentCommission.id,
    amount:
      currentCommission?.type === CommissionType.Fixed
        ? currentCommission.amount
        : Math.round((amount * (currentCommission.amount / 100) + Number.EPSILON) * 100) / 100
  }
}

export const buildEmailBody = (
  emailTemplateName: EmailTemplateName,
  params: Record<string, string | number | undefined>
) => {
  const emailTemplate = emailTemplates[emailTemplateName]

  let emailBody = emailTemplate
  Object.entries(params).forEach(([key, param]) => {
    emailBody = emailBody.replace(`{{${key}}}`, param ? `${param}` : '')
  })
  return emailBody
}
