import axios from 'axios'
import qs from 'qs'
import { UserRole } from 'safe-shore-common'

export const getAccessToken = async (): Promise<string> => {
  const clientId = process.env.AD_CLIENT_ID
  const clientSecret = process.env.AD_CLIENT_SECRET
  const tenantID = process.env.AZURE_TENANT_ID
  if (!clientId || !clientSecret || !tenantID)
    throw new Error('Define AD_CLIENT_ID and AD_CLIENT_SECRET and AZURE_TENANT_ID in env')

  const data = qs.stringify({
    grant_type: 'client_credentials',
    client_id: clientId,
    client_secret: clientSecret,
    scope: 'https://graph.microsoft.com/.default'
  })

  const getAccessTokenUrl = `https://login.microsoftonline.com/${tenantID}/oauth2/v2.0/token`

  try {
    const AccessToken = await axios.post(getAccessTokenUrl, data)
    console.log('got access token successfully')

    return AccessToken?.data?.access_token
  } catch (error) {
    console.log(error)
    throw { error: 'error while trying to get azure access token', message: error }
  }
}

export const createAdminUserInB2C = async (
  firstName: string,
  lastName: string,
  email: string,
  phone: string
): Promise<any> => {
  const tenantName = process.env.AZURE_TENANT_NAME
  if (!tenantName) throw new Error('Define AZURE_TENANT_NAME in env')
  const roleExtension = process.env.ROLE_EXTENSION || 'extension_483899360d944bc29b67a8d2d087e15b_role'
  const userPrincipalName = `${firstName}${phone}@${tenantName}`
  const accessToken = await getAccessToken()

  const headers = {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  }

  const data = {
    accountEnabled: true,
    displayName: `${firstName} ${lastName}`,
    givenName: firstName,
    surname: lastName,
    userPrincipalName: userPrincipalName,
    mobilePhone: phone,
    mail: email,
    [roleExtension]: UserRole.Admin,
    identities: [
      {
        signInType: 'emailAddress',
        issuer: tenantName,
        issuerAssignedId: email //this is the sign in mail
      }
    ],
    passwordProfile: {
      forceChangePasswordNextSignIn: true, // put false for permanent password
      password: 'Aa123456'
    }
  }
  const createUserUrl = 'https://graph.microsoft.com/v1.0/users'

  try {
    const newUser = await axios.post(createUserUrl, data, { headers })
    return newUser.data
  } catch (error) {
    console.log(error?.response?.data)
    throw { error: 'error while trying to create admin user', message: error }
  }
}
