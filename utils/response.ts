import { AxiosResponse } from 'axios'

export const validateResponse = (response: AxiosResponse<any>): boolean =>
  Boolean(response?.config?.validateStatus(response?.status))
