import { AxiosRequestConfig, AxiosResponse } from 'axios'
import getAxiosInstance from '@api/axiosInstanse'

export default abstract class BaseApi {
  get _commonConfigOptions(): Partial<AxiosRequestConfig> {
    return {}
  }
  async get<ResponseBodyType = any>(
    endpoint: string,
    config: AxiosRequestConfig = {}
  ): Promise<AxiosResponse<ResponseBodyType>> {
    Object.assign(config, this._commonConfigOptions)
    return getAxiosInstance().get<ResponseBodyType>(endpoint, config)
  }

  async post<ResponseBodyType = any, RequestBodyType = any>(
    endpoint: string,
    data: RequestBodyType,
    config: AxiosRequestConfig<RequestBodyType> = {}
  ): Promise<AxiosResponse<ResponseBodyType>> {
    Object.assign(config, this._commonConfigOptions)
    return getAxiosInstance().post<ResponseBodyType>(endpoint, data, config)
  }

  async put<ResponseBodyType = any, RequestBodyType = any>(
    endpoint: string,
    data: RequestBodyType,
    config: AxiosRequestConfig<RequestBodyType> = {}
  ): Promise<AxiosResponse<ResponseBodyType>> {
    Object.assign(config, this._commonConfigOptions)
    return getAxiosInstance().put<ResponseBodyType>(endpoint, data, config)
  }

  async patch<ResponseBodyType = any, RequestBodyType = any>(
    endpoint: string,
    data: RequestBodyType,
    config: AxiosRequestConfig<RequestBodyType> = {}
  ): Promise<AxiosResponse<ResponseBodyType>> {
    Object.assign(config, this._commonConfigOptions)
    return getAxiosInstance().patch<ResponseBodyType>(endpoint, data, config)
  }
}
