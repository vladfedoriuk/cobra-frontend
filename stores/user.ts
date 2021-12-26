import BaseStore from '@stores/base'
import { action, makeObservable, observable, runInAction } from 'mobx'
import { RootStore } from '@stores/root'
import { User as UserType } from '@typings/userStore'
import UserApi from '@api/user'
import {
  LoginRequestData,
  LoginResponseData,
  LoginErrorsData,
  RegisterRequestData,
  RegisterResponseData,
  RegisterErrorsData,
  ActivateResponseData,
  ResendActivationErrorsData,
  ResendActivationRequestData,
  ResendActivationResponseData,
} from '@typings/userApi'
import { authorizeUser } from '@utils/cookies'
import { AxiosRequestConfig, AxiosResponse } from 'axios'

export default class UserStore extends BaseStore<UserType> {
  user: UserType = {} as UserType
  api: UserApi = null

  constructor(rootStore: Readonly<RootStore>) {
    super(rootStore)
    this.api = new UserApi()
    makeObservable(this, {
      user: observable,
      register: action.bound,
    })
  }

  async resendActivation(
    resendActivationData: ResendActivationRequestData,
    onSuccess: (data: ResendActivationResponseData) => void = null,
    onBadResponse: (data: ResendActivationErrorsData) => void = null,
    onBadRequest: (
      requestConfig: AxiosRequestConfig<ResendActivationRequestData>
    ) => void = null
  ): Promise<ActivateResponseData | void> {
    return await UserApi.withErrorsHandling(
      this.api
        .resendActivation(resendActivationData)
        .then((response: AxiosResponse<ResendActivationResponseData>) => {
          if (onSuccess !== null) {
            onSuccess(response.data)
          }
          return response.data
        }),
      onBadResponse,
      onBadRequest
    )
  }

  async register(
    registerData: RegisterRequestData,
    onSuccess: (data: RegisterResponseData) => void = null,
    onBadResponse: (data: RegisterErrorsData) => void = null,
    onBadRequest: (
      requestConfig: AxiosRequestConfig<RegisterRequestData>
    ) => void = null
  ): Promise<RegisterResponseData | void> {
    return await UserApi.withErrorsHandling(
      this.api
        .register(registerData)
        .then((response: AxiosResponse<RegisterResponseData>) => {
          runInAction(() => {
            this.user.firstName = registerData.first_name
            this.user.lastName = registerData.last_name
            this.user.email = registerData.email
            this.user.username = registerData.username
          })
          if (onSuccess !== null) {
            onSuccess(response.data)
          }
          return response.data
        }),
      onBadResponse,
      onBadRequest
    )
  }

  async login(
    loginData: LoginRequestData,
    onSuccess: (data: LoginResponseData) => void = null,
    onBadResponse: (data: LoginErrorsData) => void = null,
    onBadRequest: (
      requestConfig: AxiosRequestConfig<LoginRequestData>
    ) => void = null
  ): Promise<LoginResponseData | void> {
    return await UserApi.withErrorsHandling(
      this.api
        .login(loginData)
        .then((response: AxiosResponse<LoginResponseData>) => {
          authorizeUser(response.data)
          if (onSuccess !== null) {
            onSuccess(response.data)
          }
          return response.data
        }),
      onBadResponse,
      onBadRequest
    )
  }
}
