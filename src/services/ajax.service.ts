import axios, { AxiosError } from 'axios'

export default class AjaxService {
  static instance: AjaxService

  constructor() {
    if (AjaxService.instance) {
      return AjaxService.instance
    }
    AjaxService.instance = this
  }

  static getInstance = () => AjaxService.instance || new AjaxService()
  static getBaseUrl = async () => process.env.MICROSOFT_BASE_URL
  static getToken = async () => process.env.TOKEN

  get = async (partialUrl: string): Promise<any> => {
    const token = await AjaxService.getToken()
    const baseUrl = await AjaxService.getBaseUrl()

    const headers = {
      Authorization: `Bearer ${token}`
    }

    const completeUrl = baseUrl + partialUrl

    try {
      const res = await axios.get(completeUrl, { headers })
      return await Promise.resolve(res)
    } catch (error: any) {
      return this.handleResponseError(error)
    }
  }

  post = async (partialUrl: string, data: Record<string, any> = {}): Promise<any> => {
    const token = await AjaxService.getToken()
    const baseUrl = await AjaxService.getBaseUrl()

    const headers = {
      Authorization: `Bearer ${token}`
    }

    const completeUrl = baseUrl + partialUrl

    try {
      const res = await axios.post(completeUrl, data, { headers })
      return await Promise.resolve(res)
    } catch (error: any) {
      return this.handleResponseError(error)
    }
  }

  handleResponseError = (error: AxiosError<any>) => {
    const apiError = {
      message: error.message,
      data: error?.response?.data,
      statusCode: error?.response?.data?.statusCode
    }
    return Promise.reject(apiError)
  }
}
