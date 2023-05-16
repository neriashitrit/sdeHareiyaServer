import _ from 'lodash';
import { Tables } from '../constants';
import {
  ITransaction,
  ITransactionDispute,
  ITransactionProductProperty,
  ITransactionSide,
  ITransactionStage,
} from 'safe-shore-common';
import {
  transactionModel,
  transactionProductPropertyModel,
  transactionSideModel,
  transactionStageModel,
} from '../models';

const toCamelCase = (string: string) => {
  return string.replace(/([-_][a-z])/gi, (char) => {
    return char.toUpperCase().replace('-', '').replace('_', '');
  });
};

const isObject = (object: any) => {
  return (
    object === Object(object) &&
    !isArray(object) &&
    typeof object !== 'function'
  );
};

const isArray = (array: any) => {
  return Array.isArray(array);
};

export const convertKeysToCamelCase = (object: any) => {
  if (
    isObject(object) &&
    typeof object !== 'undefined' &&
    !(object instanceof Date)
  ) {
    const n: any = {};

    Object.keys(object).forEach((key) => {
      n[toCamelCase(key)] = convertKeysToCamelCase(object[key]);
    });

    return n;
  } else if (isArray(object)) {
    return object.map((i: any) => {
      return convertKeysToCamelCase(i);
    });
  }

  return object;
};

export const getFormattedPrefix = (index: number, prefixes?: string[]) => {
  return _.isNil(prefixes)
    ? ''
    : `${prefixes[index] ? prefixes[index] + '.' : ''}`;
};

export const getJsonBuildObject = (
  tableName: Tables,
  prefixes?: string[]
): string => {
  switch (tableName) {
    case Tables.BANK_DETAILS:
      return (
        `'id', ${getFormattedPrefix(0, prefixes)}id,` +
        `'account', ${getFormattedPrefix(1, prefixes)}*,` +
        `'is_active', ${getFormattedPrefix(0, prefixes)}is_active,` +
        `'bank_name', ${getFormattedPrefix(0, prefixes)}bank_name,` +
        `'branch_name', ${getFormattedPrefix(0, prefixes)}branch_name,` +
        `'branch_number', ${getFormattedPrefix(0, prefixes)}branch_number,` +
        `'bank_account_owner_full_name', ${getFormattedPrefix(
          0,
          prefixes
        )}bank_account_owner_full_name,` +
        `'bank_account_owner_id_number', ${getFormattedPrefix(
          0,
          prefixes
        )}bank_account_owner_id_number,` +
        `'bank_account_number', ${getFormattedPrefix(
          0,
          prefixes
        )}bank_account_number,` +
        `'created_at', ${getFormattedPrefix(0, prefixes)}created_at,` +
        `'updated_at', ${getFormattedPrefix(0, prefixes)}updated_at`
      );
    case Tables.ACCOUNTS:
      return (
        `'id', ${getFormattedPrefix(0, prefixes)}id,` +
        `'type', ${getFormattedPrefix(0, prefixes)}type,` +
        `'authorization_status', ${getFormattedPrefix(
          0,
          prefixes
        )}authorization_status,` +
        `'occupation', ${getFormattedPrefix(0, prefixes)}occupation,` +
        `'postal_code', ${getFormattedPrefix(0, prefixes)}postal_code,` +
        `'country', ${getFormattedPrefix(0, prefixes)}country,` +
        `'city', ${getFormattedPrefix(0, prefixes)}city,` +
        `'street_name', ${getFormattedPrefix(0, prefixes)}street_name,` +
        `'house_number', ${getFormattedPrefix(0, prefixes)}house_number,` +
        `'apartment_number', ${getFormattedPrefix(
          0,
          prefixes
        )}apartment_number,` +
        `'is_third_party', ${getFormattedPrefix(0, prefixes)}is_third_party,` +
        `'third_party_full_name', ${getFormattedPrefix(
          0,
          prefixes
        )}third_party_full_name,` +
        `'is_bank_account_blocked', ${getFormattedPrefix(
          0,
          prefixes
        )}is_bank_account_blocked,` +
        `'created_at', ${getFormattedPrefix(0, prefixes)}created_at,` +
        `'updated_at', ${getFormattedPrefix(0, prefixes)}updated_at`
      );
    case Tables.USERS:
      return (
        `'id', ${getFormattedPrefix(0, prefixes)}id,` +
        `'is_activated', ${getFormattedPrefix(0, prefixes)}is_activated,` +
        `'is_active', ${getFormattedPrefix(0, prefixes)}is_active,` +
        `'active_directory_uuid', ${getFormattedPrefix(
          0,
          prefixes
        )}active_directory_uuid,` +
        `'role', ${getFormattedPrefix(0, prefixes)}role,` +
        `'first_name', ${getFormattedPrefix(0, prefixes)}first_name,` +
        `'last_name', ${getFormattedPrefix(0, prefixes)}last_name,` +
        `'phone_number', ${getFormattedPrefix(0, prefixes)}phone_number,` +
        `'email', ${getFormattedPrefix(0, prefixes)}email,` +
        `'id_number', ${getFormattedPrefix(0, prefixes)}id_number,` +
        `'id_number_country_of_issue', ${getFormattedPrefix(
          0,
          prefixes
        )}id_number_country_of_issue,` +
        `'last_active_at', ${getFormattedPrefix(0, prefixes)}last_active_at,` +
        `'newsletter_subscription', ${getFormattedPrefix(
          0,
          prefixes
        )}newsletter_subscription,` +
        `'birthday', ${getFormattedPrefix(0, prefixes)}birthday,` +
        `'gender', ${getFormattedPrefix(0, prefixes)}gender,` +
        `'created_at', ${getFormattedPrefix(0, prefixes)}created_at,` +
        `'updated_at', ${getFormattedPrefix(0, prefixes)}updated_at`
      );
    case Tables.TRANSACTIONS:
      return (
        `'id', ${getFormattedPrefix(0, prefixes)}id,` +
        `'status', ${getFormattedPrefix(0, prefixes)}status,` +
        `'product_category_id', ${getFormattedPrefix(
          0,
          prefixes
        )}product_category_id,` +
        `'product_category_other', ${getFormattedPrefix(
          0,
          prefixes
        )}product_category_other,` +
        `'product_subcategory_id', ${getFormattedPrefix(
          0,
          prefixes
        )}product_subcategory_id,` +
        `'product_subcategory_other', ${getFormattedPrefix(
          0,
          prefixes
        )}product_subcategory_other,` +
        `'creator_side', ${getFormattedPrefix(0, prefixes)}creator_side,` +
        `'amount_currency', ${getFormattedPrefix(
          0,
          prefixes
        )}amount_currency,` +
        `'amount', ${getFormattedPrefix(0, prefixes)}amount,` +
        `'commission_id', ${getFormattedPrefix(0, prefixes)}commission_id,` +
        `'commission_payer', ${getFormattedPrefix(
          0,
          prefixes
        )}commission_payer,` +
        `'commission_amount_currency', ${getFormattedPrefix(
          0,
          prefixes
        )}commission_amount_currency,` +
        `'commission_amount', ${getFormattedPrefix(
          0,
          prefixes
        )}commission_amount,` +
        `'end_date', ${getFormattedPrefix(0, prefixes)}end_date,` +
        `'cancel_reason', ${getFormattedPrefix(0, prefixes)}cancel_reason,` +
        `'cancel_reason_other', ${getFormattedPrefix(
          0,
          prefixes
        )}cancel_reason_other,` +
        `'created_at', ${getFormattedPrefix(0, prefixes)}created_at,` +
        `'updated_at', ${getFormattedPrefix(0, prefixes)}updated_at`
      );
    case Tables.PRODUCT_PROPERTIES:
      return (
        `'id', ${getFormattedPrefix(0, prefixes)}id,` +
        `'product_category_id', ${getFormattedPrefix(
          0,
          prefixes
        )}product_category_id,` +
        `'name', ${getFormattedPrefix(0, prefixes)}name,` +
        `'type', ${getFormattedPrefix(0, prefixes)}type,` +
        `'label', ${getFormattedPrefix(0, prefixes)}label,` +
        `'validation', ${getFormattedPrefix(0, prefixes)}validation,` +
        `'multiple_files', ${getFormattedPrefix(0, prefixes)}multiple_files,` +
        `'line_count_text', ${getFormattedPrefix(
          0,
          prefixes
        )}line_count_text,` +
        `'select_options', ${getFormattedPrefix(0, prefixes)}select_options,` +
        `'helper_text', ${getFormattedPrefix(0, prefixes)}helper_text,` +
        `'created_at', ${getFormattedPrefix(0, prefixes)}created_at,` +
        `'updated_at', ${getFormattedPrefix(0, prefixes)}updated_at`
      );
    case Tables.TRANSACTION_SIDES:
      return (
        `'id', ${getFormattedPrefix(0, prefixes)}id,` +
        `'side', ${getFormattedPrefix(0, prefixes)}side,` +
        `'user_account', ${getFormattedPrefix(1, prefixes)}*,` +
        `'bank_details', ${getFormattedPrefix(2, prefixes)}*,` +
        `'created_at', ${getFormattedPrefix(0, prefixes)}created_at,` +
        `'updated_at', ${getFormattedPrefix(0, prefixes)}updated_at`
      );
    case Tables.PRODUCT_CATEGORIES:
      return (
        `'id', ${getFormattedPrefix(0, prefixes)}id,` +
        `'name', ${getFormattedPrefix(0, prefixes)}name,` +
        `'description', ${getFormattedPrefix(0, prefixes)}description,` +
        `'icon', ${getFormattedPrefix(1, prefixes)}url,` +
        `'created_at', ${getFormattedPrefix(0, prefixes)}created_at,` +
        `'updated_at', ${getFormattedPrefix(0, prefixes)}updated_at`
      );
    case Tables.PRODUCT_SUBCATEGORIES:
      return (
        `'id', ${getFormattedPrefix(0, prefixes)}id,` +
        `'name', ${getFormattedPrefix(0, prefixes)}name,` +
        `'description', ${getFormattedPrefix(0, prefixes)}description,` +
        `'icon', ${getFormattedPrefix(1, prefixes)}url,` +
        `'created_at', ${getFormattedPrefix(0, prefixes)}created_at,` +
        `'updated_at', ${getFormattedPrefix(0, prefixes)}updated_at`
      );
    case Tables.COMMISSIONS:
      return (
        `'id', ${getFormattedPrefix(0, prefixes)}id,` +
        `'is_active', ${getFormattedPrefix(0, prefixes)}is_active,` +
        `'from', ${getFormattedPrefix(0, prefixes)}from,` +
        `'to', ${getFormattedPrefix(0, prefixes)}to,` +
        `'type', ${getFormattedPrefix(0, prefixes)}type,` +
        `'amount', ${getFormattedPrefix(0, prefixes)}amount,` +
        `'created_at', ${getFormattedPrefix(0, prefixes)}created_at,` +
        `'updated_at', ${getFormattedPrefix(0, prefixes)}updated_at`
      );
    case Tables.TRANSACTION_PRODUCT_PROPERTIES:
      return (
        `'id', ${getFormattedPrefix(0, prefixes)}id,` +
        `'value', ${getFormattedPrefix(0, prefixes)}value,` +
        `'product_property', ${getFormattedPrefix(1, prefixes)}*,` +
        `'created_at', ${getFormattedPrefix(0, prefixes)}created_at,` +
        `'updated_at', ${getFormattedPrefix(0, prefixes)}updated_at`
      );
    default:
      return '';
  }
};

export const successResponse = (body: Record<string, any>) => {
  return { status: { success: true }, body };
};
export const failureResponse = (error?: any) => {
  return { status: { success: false, error } };
};

export const buildRange = (
  queryBuilder: any,
  column: string,
  startDate?: string,
  endDate?: string
) => {
  if (startDate && endDate) {
    // If both start and end dates are specified, filter by the date range
    queryBuilder.whereBetween(column, [
      `${startDate} 00:00:00`,
      `${endDate} 23:59:59`,
    ]);
  } else if (startDate) {
    // If only the start date is specified, filter by that date and later
    queryBuilder.where(column, '>=', `${startDate} 00:00:00`);
  } else if (endDate) {
    // If only the end date is specified, filter by that date and earlier
    queryBuilder.where(column, '<=', `${endDate} 23:59:59`);
  }
};
