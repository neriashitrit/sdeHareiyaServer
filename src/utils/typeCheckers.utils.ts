import _ from 'lodash';
import {
  AccountAuthorizationCompanyBody,
  AccountAuthorizationPrivateBody,
  AdminApproveStageBody,
  ApproveStageBody,
  CreateProductCategoryBody,
  CreateTransactionBody,
  GetTransactionParams,
  UpdateTransactionBody,
  UpdateUserBody,
} from '../types/requestBody.types';

export const isUpdateTransactionBody = (
  body: any
): body is UpdateTransactionBody => {
  return (
    typeof body === 'object' &&
    body !== null &&
    typeof body.transactionId === 'number' &&
    (_.isNil(body.productCategoryId) ||
      typeof body.productCategoryId === 'number') &&
    (_.isNil(body.productCategoryOther) ||
      typeof body.productCategoryOther === 'string') &&
    (_.isNil(body.productSubcategoryId) ||
      typeof body.productSubcategoryId === 'number') &&
    (_.isNil(body.productSubcategoryOther) ||
      typeof body.productSubcategoryOther === 'string') &&
    (_.isNil(body.currency) || typeof body.currency === 'string') &&
    (_.isNil(body.amount) || typeof body.amount === 'number') &&
    (_.isNil(body.properties) ||
      (Array.isArray(body.properties) &&
        body.properties.every(
          (property: any) =>
            typeof property === 'object' &&
            !_.isNil(property) &&
            typeof property.productPropertyId === 'number' &&
            (typeof property.value === 'number' ||
              typeof property.value === 'string' ||
              typeof property.value === 'boolean' ||
              _.isNil(property.value))
        ))) &&
    (_.isNil(body.endDate) || typeof body.endDate === 'string') &&
    (_.isNil(body.commissionPayer) ||
      typeof body.commissionPayer === 'string') &&
    (_.isNil(body.creatorSide) || typeof body.creatorSide === 'string') &&
    (_.isNil(body.firstName) || typeof body.firstName === 'string') &&
    (_.isNil(body.lastName) || typeof body.lastName === 'string') &&
    (_.isNil(body.phoneNumber) || typeof body.phoneNumber === 'string') &&
    (_.isNil(body.email) || typeof body.email === 'string')
  );
};

export const isCreateTransactionBody = (
  body: any
): body is CreateTransactionBody => {
  return (
    typeof body === 'object' &&
    !_.isNil(body) &&
    typeof body.productCategoryId === 'number' &&
    (_.isNil(body.productCategoryOther) ||
      typeof body.productCategoryOther === 'string') &&
    (_.isNil(body.productSubcategoryId) ||
      typeof body.productSubcategoryId === 'number') &&
    (_.isNil(body.productSubcategoryOther) ||
      typeof body.productSubcategoryOther === 'string') &&
    typeof body.currency === 'string' &&
    typeof body.amount === 'number' &&
    Array.isArray(body.properties) &&
    body.properties.every(
      (property: any) =>
        typeof property === 'object' &&
        !_.isNil(property) &&
        typeof property.productPropertyId === 'number' &&
        (typeof property.value === 'number' ||
          typeof property.value === 'string' ||
          typeof property.value === 'boolean' ||
          _.isNil(property.value))
    )
  );
};

export const isApproveStageBody = (body: any): body is ApproveStageBody => {
  return (
    typeof body === 'object' &&
    !_.isNil(body) &&
    typeof body.transactionId === 'number' &&
    (_.isNil(body.depositBankName) ||
      typeof body.depositBankName === 'string') &&
    (_.isNil(body.depositBankNumber) ||
      typeof body.depositBankNumber === 'number' ||
      typeof +body.depositBankNumber === 'number') &&
    (_.isNil(body.depositBankAccountOwnerFullName) ||
      typeof body.depositBankAccountOwnerFullName === 'string') &&
    (_.isNil(body.depositTransferDate) ||
      typeof body.depositTransferDate === 'string') &&
    (_.isNil(body.depositReferenceNumber) ||
      typeof body.depositReferenceNumber === 'string') &&
    (_.isNil(body.deliveryDate) || typeof body.deliveryDate === 'string') &&
    (_.isNil(body.deliveryType) || typeof body.deliveryType === 'string') &&
    (_.isNil(body.deliveryNotes) || typeof body.deliveryNotes === 'string')
    // _.isNil(body.depositReferenceFile) ||
    // typeof body.depositReferenceFile === 'object'
  );
};

export const isAdminApproveStageBody = (
  body: any
): body is AdminApproveStageBody => {
  return (
    typeof body === 'object' &&
    !_.isNil(body) &&
    (typeof body.transactionId === 'number' ||
      typeof +body.transactionId === 'number')
  );
};

export const isGetTransactionParams = (
  params: any
): params is GetTransactionParams => {
  return (
    typeof params === 'object' &&
    !_.isNil(params) &&
    (typeof params.transactionId === 'number' ||
      typeof +params.transactionId === 'number')
  );
};

export const isCreateProductCategoryBody = (
  body: any
): body is CreateProductCategoryBody => {
  return (
    typeof body === 'object' &&
    !_.isNil(body) &&
    typeof body.name === 'string' &&
    typeof body.description === 'string' &&
    typeof body.isActive === 'boolean' &&
    typeof body.icon === 'object' &&
    Array.isArray(body.properties) &&
    body.properties.every(
      (prop: any) =>
        typeof prop.name === 'string' &&
        typeof prop.type === 'string' &&
        typeof prop.label === 'string' &&
        (_.isNil(prop.validation) || typeof prop.validation === 'object') &&
        (_.isNil(prop.multipleFiles) ||
          typeof prop.multipleFiles === 'boolean') &&
        (_.isNil(prop.linesCountText) ||
          typeof prop.linesCountText === 'number') &&
        (_.isNil(prop.selectOptions) || Array.isArray(prop.selectOptions)) &&
        (_.isNil(prop.helperText) || typeof prop.helperText === 'string')
    ) &&
    Array.isArray(body.subcategories) &&
    body.subcategories.every(
      (subcategory: any) =>
        typeof subcategory.name === 'string' &&
        typeof subcategory.isActive === 'boolean' &&
        typeof subcategory.icon === 'object'
    )
  );
};

export const isUpdateUserBody = (body: any): body is UpdateUserBody => {
  return (
    typeof body === 'object' &&
    !_.isNil(body) &&
    (_.isNil(body.firstName) || typeof body.firstName === 'string') &&
    (_.isNil(body.lastName) || typeof body.lastName === 'string')
  );
};

export const isAccountAuthorizationBaseBody = (body: any): boolean => {
  return (
    typeof body === 'object' &&
    !_.isNil(body) &&
    typeof body.postalCode === 'string' &&
    typeof body.country === 'string' &&
    typeof body.city === 'string' &&
    typeof body.streetName === 'string' &&
    typeof body.houseNumber === 'string' &&
    typeof body.apartmentNumber === 'string' &&
    typeof body.occupation === 'string'
  );
};

export const isAccountAuthorizationPrivateBody = (
  body: any
): body is AccountAuthorizationPrivateBody => {
  return (
    isAccountAuthorizationBaseBody(body) &&
    typeof body.idNumberCountryOfIssue === 'string' &&
    typeof body.birthday === 'string' &&
    typeof body.gender === 'string' &&
    typeof body.isThirdParty === 'boolean' &&
    (!body.isThirdParty
      ? _.isNil(body.isThirdPartyFullName)
      : typeof body.isThirdPartyFullName === 'string') &&
    typeof body.isBankAccountBlocked === 'boolean'
  );
};

export const isAccountAuthorizationCompanyBody = (
  body: any
): body is AccountAuthorizationCompanyBody => {
  return (
    isAccountAuthorizationBaseBody(body) &&
    typeof body.companyIdentityNumber === 'number' &&
    typeof body.incorporationName === 'string' &&
    typeof body.incorporationDate === 'string' &&
    typeof body.incorporationCountry === 'string' &&
    typeof body.fundsSource === 'string' &&
    (body.fundsSource !== 'other'
      ? _.isNil(body.fundsSourceOther)
      : typeof body.fundsSourceOther === 'string') &&
    Array.isArray(body.contacts) &&
    body.contacts.every(
      (contact: any) =>
        typeof contact === 'object' &&
        !_.isNil(contact) &&
        typeof contact.fullName === 'string' &&
        typeof contact.idNumber === 'string'
    ) &&
    body.contacts.length > 0 &&
    typeof body.activeYears === 'number' &&
    typeof body.purpose === 'string'
  );
};
