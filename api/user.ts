import BaseApi from '@api/base'
import {
  ActivateRequestData,
  ActivateResponseData,
  GetProfileResponseData,
  GetUsersResponseData,
  LoginRequestData,
  LoginResponseData,
  PasswordResetConfirmRequestData,
  PasswordResetConfirmResponseData,
  PasswordResetRequestData,
  PasswordResetResponseData,
  PatchProfileRequestData,
  PatchProfileResponseData,
  RefreshTokenRequestData,
  RefreshTokenResponseData,
  RegisterRequestData,
  RegisterResponseData,
  ResendActivationRequestData,
  ResendActivationResponseData,
} from '@typings/userApi'
import { NextContext } from '@typings/utils'
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  unauthenticateUser,
} from '@utils/cookies'
import { isTokenInvalidResponse } from '@utils/response'

import axios from 'axios'
import { AxiosResponse } from 'axios'

export default class UserApi extends BaseApi {
  patchProfile(
    patchProfileData: PatchProfileRequestData,
    ctx: NextContext['ctx'] = null
  ): Promise<AxiosResponse<PatchProfileResponseData>> {
    return this.patch<PatchProfileResponseData, PatchProfileRequestData>(
      'auth/me/',
      patchProfileData,
      {
        headers: { ...this.authenticationHeaders(ctx) },
      }
    )
  }

  getProfile(
    ctx: NextContext['ctx'] = null
  ): Promise<AxiosResponse<GetProfileResponseData>> {
    return this.get<GetProfileResponseData>('auth/me/', {
      headers: { ...this.authenticationHeaders(ctx) },
    })
  }

  getUsers(
    ctx: NextContext['ctx'] = null
  ): Promise<AxiosResponse<GetUsersResponseData>> {
    return this.get<GetUsersResponseData>('users/', {
      headers: { ...this.authenticationHeaders(ctx) },
    })
  }

  login(
    loginData: LoginRequestData
  ): Promise<AxiosResponse<LoginResponseData>> {
    return this.post<LoginResponseData, LoginRequestData>(
      'auth/jwt/create/',
      loginData
    )
  }

  register(
    registerData: RegisterRequestData
  ): Promise<AxiosResponse<RegisterResponseData>> {
    return this.post<RegisterResponseData, RegisterRequestData>(
      'auth/register/',
      registerData
    )
  }

  verifyToken(
    accessToken: string
  ): Promise<AxiosResponse<Record<string, unknown>>> {
    return this.post<Record<string, unknown>, { token: string }>(
      'auth/jwt/verify/',
      {
        token: accessToken,
      }
    )
  }

  refreshToken(
    refreshToken: string
  ): Promise<AxiosResponse<RefreshTokenResponseData>> {
    return this.post<RefreshTokenResponseData, RefreshTokenRequestData>(
      'auth/jwt/refresh/',
      {
        refresh: refreshToken,
      }
    )
  }

  activate(
    activationData: ActivateRequestData
  ): Promise<AxiosResponse<ActivateResponseData>> {
    return this.post<ActivateResponseData, ActivateRequestData>(
      'auth/activate/',
      activationData
    )
  }

  resendActivation(
    resendActivatonData: ResendActivationRequestData
  ): Promise<AxiosResponse<ResendActivationResponseData>> {
    return this.post<ResendActivationResponseData, ResendActivationRequestData>(
      'auth/activate/resend/',
      resendActivatonData
    )
  }

  passwordReset(
    passwordResetData: PasswordResetRequestData
  ): Promise<AxiosResponse<PasswordResetResponseData>> {
    return this.post<PasswordResetResponseData, PasswordResetRequestData>(
      'auth/reset_password/',
      passwordResetData
    )
  }

  passwordResetConfirm(
    passwordResetConfirmData: PasswordResetConfirmRequestData
  ): Promise<AxiosResponse<PasswordResetConfirmResponseData>> {
    return this.post<
      PasswordResetConfirmResponseData,
      PasswordResetConfirmRequestData
    >('auth/reset_password/confirm/', passwordResetConfirmData)
  }

  async isAuthenticated(ctx: NextContext['ctx'] = null): Promise<boolean> {
    const accessToken = getAccessToken({ ctx })
    const refreshToken = getRefreshToken({ ctx })
    if (!accessToken || !refreshToken) {
      return false
    }
    return this.verifyToken(accessToken)
      .then(() => true)
      .catch(async (error) => {
        if (axios.isAxiosError(error)) {
          if (isTokenInvalidResponse(error)) {
            return await this.refreshToken(refreshToken)
              .then((response) => {
                const { access } = response?.data
                setAccessToken({ ctx, access })
                return true
              })
              .catch((error) => {
                if (axios.isAxiosError(error)) {
                  if (isTokenInvalidResponse(error)) {
                    unauthenticateUser({ ctx })
                  }
                }
                return false
              })
          }
          return false
        }
        return false
      })
  }
}
