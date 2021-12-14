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
} from '@typings/userApi'
import {
  setCookie,
  JWT_ACCESS_COOKIE_NAME,
  JWT_REFRESH_COOKIE_NAME,
} from '@utils/cookies'
import axios, { AxiosResponse } from 'axios'

export class UserStore extends BaseStore<UserType> {
  user: UserType = {} as UserType
  api: UserApi = null

  constructor(rootStore: RootStore) {
    super(rootStore)
    this.api = new UserApi()
    makeObservable(this, {
      user: observable,
      register: action.bound,
    })
  }

  async register(
    registerData: RegisterRequestData,
    onSuccess: (data: RegisterResponseData) => void = null,
    onFailure: (data: RegisterErrorsData) => void = null
  ): Promise<RegisterResponseData | void> {
    return await this.api
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
      })
      .catch(<ErrorType extends Error>(error: ErrorType) => {
        if (axios.isAxiosError(error)) {
          if (onFailure !== null) {
            onFailure(error.response.data)
          }
        }
        // eslint-disable-next-line no-console
        console.log(
          `Error has occured in UserStore.register(): ${String(error)}`
        )
        // TODO: Add handling the Error case (maybe snackbar store)
      })
  }

  async login(
    loginData: LoginRequestData,
    onSuccess: (data: LoginResponseData) => void = null,
    onFailure: (data: LoginErrorsData) => void = null
  ): Promise<LoginResponseData | void> {
    return await this.api
      .login(loginData)
      .then((response: AxiosResponse<LoginResponseData>) => {
        const { access, refresh } = response.data
        setCookie({
          cookieName: JWT_ACCESS_COOKIE_NAME,
          cookieValue: access,
        })
        setCookie({
          cookieName: JWT_REFRESH_COOKIE_NAME,
          cookieValue: refresh,
        })
        if (onSuccess !== null) {
          onSuccess(response.data)
        }
        return response.data
      })
      .catch(<ErrorType extends Error>(error: ErrorType) => {
        if (axios.isAxiosError(error)) {
          if (error?.response?.data) {
            if (onFailure !== null) {
              onFailure(error.response.data)
            }
          }
        }
        // eslint-disable-next-line no-console
        console.log(`Error has occured in UserStore.login(): ${String(error)}`)
        // TODO: Add handling the Error case (maybe snackbar store)
      })
  }
}
