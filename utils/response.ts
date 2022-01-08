import { AxiosError, AxiosResponse } from 'axios'

export const validateResponse = (response: AxiosResponse<any>): boolean =>
  Boolean(response?.config?.validateStatus(response?.status))

export const isTokenInvalidResponse = (error: AxiosError<any>): boolean =>
  error?.response?.data?.code === 'token_not_valid'
