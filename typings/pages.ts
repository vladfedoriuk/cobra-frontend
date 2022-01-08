import { AxiosResponse, AxiosError } from 'axios'
import { ActivateResponseData, ActivateErrorsData } from '@typings/userApi'

export type ActivationPageProps = {
  status: number | null
  success: boolean
  data:
    | AxiosResponse<ActivateResponseData>
    | AxiosError<ActivateErrorsData>
    | null
}
