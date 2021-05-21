import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'

export default interface BackendClientInterface {
  get(url: string, data?: object, config?: AxiosRequestConfig): Promise<any>;

  delete(url: string, data?: object, config?: AxiosRequestConfig): Promise<any>;

  post(url: string, data?: any, config?: AxiosRequestConfig): Promise<any>;

  put(url: string, data?: any, config?: AxiosRequestConfig): Promise<any>;

  patch(url: string, data?: any, config?: AxiosRequestConfig): Promise<any>;

  toDataResponse({ data, status }: AxiosResponse): any;

  toErrorResponse(errorResponse: AxiosError): any;
}
