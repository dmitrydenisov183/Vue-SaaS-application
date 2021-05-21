import BackendClientInterface from '@/types/BackendClientInterface'
import { isSuccessfulResponse } from '@/types/Response'
import { appendDataToUrlQueryString } from '@/utils/misc'
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

export default class Client implements BackendClientInterface {
  protected readonly client!: AxiosInstance

  protected get baseApiUrl (): string {
    if (!process.env.VUE_APP_BASE_API_URL) {
      throw new Error('Enviroment variable VUE_APP_BASE_API_URL must be defined')
    }

    return process.env.VUE_APP_BASE_API_URL
  }

  constructor () {
    this.client = axios.create({ baseURL: this.baseApiUrl })
  }

  post (uri: string, data?: any, config?: AxiosRequestConfig) {
    return this.client.post(uri, data, config)
  }

  put (uri: string, data?: any, config?: AxiosRequestConfig) {
    return this.client.put(uri, data, config)
  }

  patch (uri: string, data?: any, config?: AxiosRequestConfig) {
    return this.client.patch(uri, data, config)
  }

  get (uri: string, data?: object, config?: AxiosRequestConfig) {
    if (data) {
      uri = appendDataToUrlQueryString(uri, this.baseApiUrl, data)
    }

    return this.client.get(uri, config)
  }

  delete (uri: string, data?: object, config?: AxiosRequestConfig) {
    if (data) {
      uri = appendDataToUrlQueryString(uri, this.baseApiUrl, data)
    }

    return this.client.delete(uri, config)
  }

  toDataResponse (response: AxiosResponse) {
    if (isSuccessfulResponse(response)) {
      return { data: response.data, status: response.status }
    }

    return response
  }

  toErrorResponse (errorResponse: AxiosError) {
    if (errorResponse.response) {
      return { ...errorResponse.response.data, status: errorResponse.response.status }
    }

    return { errors: { _internal: 'Unexpected error' }, status: 500 }
  }
}
