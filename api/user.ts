import BaseApi from '@api/base'
import {
  LoginRequestData,
  LoginResponseData,
  RefreshTokenRequestData,
  RefreshTokenResponseData,
} from '@typings/userApi'
import {
  deleteCookie,
  getCookie,
  JWT_ACCESS_COOKIE_NAME,
  JWT_REFRESH_COOKIE_NAME,
  setCookie,
} from '@utils/cookies'

import axios from 'axios'
import { AxiosResponse } from 'axios'
import { GetServerSidePropsContext, NextPageContext } from 'next'

export default class UserApi extends BaseApi {
  async login(
    loginData: LoginRequestData
  ): Promise<AxiosResponse<LoginResponseData>> {
    return await this.post<LoginResponseData, LoginRequestData>(
      'auth/jwt/create/',
      loginData
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

  async isAuthenticated(
    ctx?: NextPageContext | GetServerSidePropsContext
  ): Promise<boolean> {
    const accessToken = getCookie({
      cookieName: JWT_ACCESS_COOKIE_NAME,
      ctx,
    })
    const refreshToken = getCookie({
      cookieName: JWT_REFRESH_COOKIE_NAME,
      ctx,
    })

    if (!accessToken || !refreshToken) {
      return false
    }
    return this.verifyToken(accessToken)
      .then(() => true)
      .catch(async (error) => {
        if (axios.isAxiosError(error)) {
          if (error?.response?.data?.detail?.code === 'token_not_valid') {
            return await this.refreshToken(refreshToken)
              .then((response) => {
                const { access } = response?.data
                setCookie({
                  cookieName: JWT_ACCESS_COOKIE_NAME,
                  cookieValue: access,
                  ctx,
                })
                return true
              })
              .catch((error) => {
                if (axios.isAxiosError(error)) {
                  if (
                    error?.response?.data?.detail?.code === 'token_not_valid'
                  ) {
                    deleteCookie({
                      cookieName: JWT_ACCESS_COOKIE_NAME,
                      ctx,
                    })
                    deleteCookie({
                      cookieName: JWT_REFRESH_COOKIE_NAME,
                      ctx,
                    })
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
