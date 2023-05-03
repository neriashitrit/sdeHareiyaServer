import _ from 'lodash';
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

const convertToCamelCase = (str: string) => str.replace(/_[a-z]/g, (match: string) => `${match[1].toUpperCase()}`);

export const convertKeysToCamelCase = <T = any>(obj: Record<string, any>): T => {
	if (_.isNil(obj)) return obj;
	const res: Record<string, any> = {};
	_.each(_.keys(obj), (key: string) => {
		res[convertToCamelCase(key)] = _.isArray(obj[key]) ? convertKeysToCamelCaseArray(obj[key]) : obj[key];
	});
	return res as T;
};
export const convertKeysToCamelCaseArray = <T = any>(objs: Record<string, any>[]): T[] => {
	const res: Record<string, any>[] = [];
	objs.forEach((obj) => {
		res.push(convertKeysToCamelCase(obj));
	});
	return res as T[];
};
