
export enum Tables {
  USERS = 'users',
}

export enum EmailTemplateName {
  CONTACT_US = 'contactUs',
}

export const emailSubjectMapping: { [key in EmailTemplateName]: string } = {
  [EmailTemplateName.CONTACT_US]: '',
}