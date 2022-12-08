import { BearerStrategy, IBearerStrategyOptionWithRequest, ITokenPayload, VerifyCallback } from 'passport-azure-ad'
import { Request, Response } from 'express'
import AuthModel from '../models/auth.model'
import { comparePasswords } from '../services/auth.service'

const authModel = new AuthModel()

// Update these four variables with values from your B2C tenant in the Azure portal
const clientID = '94c62aa3-bb15-4985-a47f-8fc003cb5caf' // Application (client) ID of your API's application registration 
const b2cDomainHost = 'safeshoredev.b2clogin.com'
const tenantId = 'safeshoredev.onmicrosoft.com' // Alternatively, you can use your Directory (tenant) ID (a GUID)
const policyName = 'B2C_1_login'

const bearerStrategyOptions: IBearerStrategyOptionWithRequest = {
  identityMetadata: `https://${b2cDomainHost}/${tenantId}/${policyName}/v2.0/.well-known/openid-configuration/`,
  clientID: clientID,
  audience: clientID,
  policyName: policyName,
  isB2C: true,
  loggingLevel: 'warn',
  passReqToCallback: false,
  validateIssuer: false
  // issuer: 'https://ubtechportal.b2clogin.com/d89cbc01-07aa-4047-833e-8682103c2d94/v2.0/'
}

export const bearerStrategy = new BearerStrategy(bearerStrategyOptions, (token: ITokenPayload, done: VerifyCallback) =>
  done(null, {}, token)
)


export const adminSenderAuth = async (req: Request, res: Response, next: any)  =>{
  console.log('in adminSenderAuth');
  const api_key= req?.headers.api_key as string
  try {
    const hashedPassword  = await authModel.getHashedPassword('safeshore')
    if (!comparePasswords(api_key,hashedPassword)){
      return res.status(403).send({
      status: 403,
      message: 'FORBIDDEN'
      })
    }
      return next()
  }catch (error) {
    return res.status(401).send(error)
  }
}


export const apiStrategy = 
async (req: any, res: any, next: any) => {
    const { company_name, api_key }  = req?.headers
    if(!company_name || !api_key) return res.status(401).send('missing params')
    try {
      const hashedPassword  = await authModel.getHashedPassword(company_name)
      if (!hashedPassword) { throw 'company not found' }
      if (!comparePasswords(api_key, hashedPassword)) {
        return res.status(403).send({
        status: 403,
        message: 'FORBIDDEN'
        })
      }
      return next();
    } catch (error) {
      return res.status(401).send(error)
    }
  }
