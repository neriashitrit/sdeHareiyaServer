import _ from 'lodash'

export const isEnvVariableEmpty = (name: string) =>
  _.isUndefined(process.env[name]) || _.isEmpty(process.env[name]) || process.env[name] === 'undefined'
