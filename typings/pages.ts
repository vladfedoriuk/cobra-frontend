import { AxiosResponse, AxiosError } from 'axios'
import { ActivateResponseData, ActivateErrorsData } from '@typings/userApi'

export type ActivationPageProps = {
  status: number
  success: boolean
  data:
    | AxiosResponse<ActivateResponseData>
    | AxiosError<ActivateErrorsData>
    | null
}
