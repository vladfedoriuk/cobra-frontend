import axios, {
  AxiosRequestConfig,
  AxiosRequestHeaders,
  AxiosResponse,
} from 'axios'
import getAxiosInstance from '@api/axiosInstanse'
import { NextContext } from '@typings/utils'
import { getAccessToken } from '@utils/cookies'

export default abstract class BaseApi {
  authenticationHeaders(ctx: NextContext['ctx'] = null): AxiosRequestHeaders {
    return {
      Authorization: `JWT ${getAccessToken({ ctx })}`,
    }
  }
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

  static withErrorsHandling<
    ResponseBodyType,
    RequestBodyType,
    ResponseErrorType
  >(
    responseDataPromise: Promise<ResponseBodyType>,
    onBadResponse: (errorData: ResponseErrorType) => void = null,
    onBadRequest: (
      requestConfig: AxiosRequestConfig<RequestBodyType>
    ) => void = null
  ): Promise<ResponseBodyType | void> {
    return responseDataPromise.catch(
      <ErrorType extends Error>(error: ErrorType) => {
        if (axios.isAxiosError(error)) {
          /*
          https://gist.github.com/fgilio/230ccd514e9381fafa51608fcf137253
          https://www.intricatecloud.io/2020/03/how-to-handle-api-errors-in-your-web-app-using-axios/
          */
          if (error.response && onBadResponse !== null) {
            /*
             * The request was made and the server responded with a
             * status code that falls out of the range of 2xx
             */

            if (error.response.status < 500) {
              onBadResponse(error.response.data)
            }
          } else if (error.request && onBadRequest != null) {
            /*
             * The request was made but no response was received, `error.request`
             * is an instance of XMLHttpRequest in the browser and an instance
             * of http.ClientRequest in Node.js
             */
            onBadRequest(error.config)
          }
        }
      }
    )
  }
}
