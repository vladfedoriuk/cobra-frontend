import BaseStore from '@stores/base'
import { action, computed, makeObservable, observable, runInAction } from 'mobx'
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
  PasswordResetErrorsData,
  PasswordResetRequestData,
  PasswordResetResponseData,
  PasswordResetConfirmErrorsData,
  PasswordResetConfirmRequestData,
  PasswordResetConfirmResponseData,
  GetProfileErrorData,
  GetProfileResponseData,
  PatchProfileResponseData,
  PatchProfileErrorData,
  PatchProfileRequestData,
} from '@typings/userApi'
import { authenticateUser, unauthenticateUser } from '@utils/cookies'
import { AxiosRequestConfig, AxiosResponse } from 'axios'
import { NextContext } from '@typings/utils'
import { convertUserData } from '@utils/user'

export default class UserStore extends BaseStore<UserType> {
  user: UserType = {} as UserType
  api: UserApi = null
  isLoggedIn = false

  constructor(rootStore: Readonly<RootStore>) {
    super(rootStore)
    this.api = new UserApi()
    makeObservable(this, {
      hydrate: action.bound,
      user: observable,
      isLoggedIn: observable,
      setProfileData: action.bound,
      resetProfileData: action.bound,
      isUserEmpty: computed,
      patchProfile: action.bound,
      getProfile: action.bound,
      login: action.bound,
      logout: action.bound,
      isAuthenticated: action.bound,
    })
  }

  logout(): void {
    unauthenticateUser({})
    this.resetProfileData()
    this.isLoggedIn = false
  }

  async isAuthenticated(ctx: NextContext['ctx'] = null): Promise<boolean> {
    return await this.api.isAuthenticated(ctx).then((isAuthenticated) => {
      runInAction(() => {
        this.isLoggedIn = isAuthenticated
      })
      return isAuthenticated
    })
  }

  get isUserEmpty(): boolean {
    return Boolean(Object.keys(this.user).length === 0)
  }

  setProfileData(data: GetProfileResponseData): void {
    runInAction(() => {
      Object.assign(this.user, convertUserData(data))
    })
  }

  resetProfileData(): void {
    this.user = {} as UserType
  }

  async patchProfile(
    patchProfileData: PatchProfileRequestData,
    onSuccess: (data: PatchProfileResponseData) => void = null,
    onBadResponse: (data: PatchProfileErrorData) => void = null,
    onBadRequest: (
      requestConfig: AxiosRequestConfig<PatchProfileRequestData>
    ) => void = null
  ): Promise<PatchProfileResponseData | void> {
    return await UserApi.withErrorsHandling(
      this.api
        .patchProfile(patchProfileData)
        .then((response: AxiosResponse<PatchProfileResponseData>) => {
          if (onSuccess !== null) {
            onSuccess(response.data)
          }
          this.setProfileData(response.data)
          return response.data
        }),
      onBadResponse,
      onBadRequest
    )
  }

  async getProfile(
    onSuccess: (data: GetProfileResponseData) => void = null,
    onBadResponse: (data: GetProfileErrorData) => void = null,
    onBadRequest: (requestConfig: AxiosRequestConfig) => void = null
  ): Promise<GetProfileResponseData | void> {
    return await UserApi.withErrorsHandling(
      this.api
        .getProfile()
        .then((response: AxiosResponse<GetProfileResponseData>) => {
          if (onSuccess !== null) {
            onSuccess(response.data)
          }
          this.setProfileData(response.data)
          return response.data
        }),
      onBadResponse,
      onBadRequest
    )
  }

  async passwordReset(
    passwordResetData: PasswordResetRequestData,
    onSuccess: (data: PasswordResetResponseData) => void = null,
    onBadResponse: (data: PasswordResetErrorsData) => void = null,
    onBadRequest: (
      requestConfig: AxiosRequestConfig<PasswordResetRequestData>
    ) => void = null
  ): Promise<PasswordResetResponseData | void> {
    return await UserApi.withErrorsHandling(
      this.api
        .passwordReset(passwordResetData)
        .then((response: AxiosResponse<PasswordResetResponseData>) => {
          if (onSuccess !== null) {
            onSuccess(response.data)
          }
          return response.data
        }),
      onBadResponse,
      onBadRequest
    )
  }

  async passwordResetConfirm(
    passwordResetConfirmData: PasswordResetConfirmRequestData,
    onSuccess: (data: PasswordResetConfirmResponseData) => void = null,
    onBadResponse: (data: PasswordResetConfirmErrorsData) => void = null,
    onBadRequest: (
      requestConfig: AxiosRequestConfig<PasswordResetConfirmRequestData>
    ) => void = null
  ): Promise<PasswordResetConfirmResponseData | void> {
    return await UserApi.withErrorsHandling(
      this.api
        .passwordResetConfirm(passwordResetConfirmData)
        .then((response: AxiosResponse<PasswordResetConfirmResponseData>) => {
          if (onSuccess !== null) {
            onSuccess(response.data)
          }
          return response.data
        }),
      onBadResponse,
      onBadRequest
    )
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
          authenticateUser(response.data)
          this.isLoggedIn = true
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
