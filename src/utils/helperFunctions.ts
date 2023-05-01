import { CommissionType, ICommission } from 'safe-shore-common';

export const commissionCalculate = (
  commissions: ICommission[],
  amount: number
): { commissionId: number | null; amount: number } => {
  const currentCommission = commissions.find(
    (commission) =>
      amount >= commission.from &&
      (commission.to === undefined || amount <= commission.to)
  );

  if (currentCommission === undefined) {
    return { commissionId: null, amount: 0 };
  }

  return {
    commissionId: currentCommission.id,
    amount:
      currentCommission?.type === CommissionType.Fixed
        ? currentCommission.amount
        : Math.round(
            (amount * (currentCommission.amount / 100) + Number.EPSILON) * 100
          ) / 100,
  };
};
