import { BearerStrategy, IBearerStrategyOptionWithRequest, ITokenPayload, VerifyCallback } from 'passport-azure-ad'
import { Request, Response } from 'express'

// TODO match it to our AD

// Update these four variables with values from your B2C tenant in the Azure portal
const clientID = 'xxxxxxxxxxxx-xxxxxxxxxxx-xxxxxxxxx-xxxxxx' // Application (client) ID of your API's application registration
const b2cDomainHost = 'xxxxx.yyyyy.com'
const tenantId = 'zzzzzzz.wwwwwwww.com' // Alternatively, you can use your Directory (tenant) ID (a GUID)
const policyName = 'B2C_1A_SIGNUP_SIGNIN'

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

export const apiSenderAuth =  (req: Request, res: Response, next: any)  =>{
  console.log('in apiSenderAuth');
  const schemaName = req.headers.company
  // todo add a call to users table and check that  req.headers.authorization after hash === users where(schemaName).hashed password 
  if (process.env.SUPER_ADMIN_PASS===req.headers.authorization){
    console.log('it is')
    return next()
  }else{
    return res.status(403).send({
      status: 403,
      message: 'FORBIDDEN'
    })
  }

}