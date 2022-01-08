import cookieCutter from 'cookie-cutter'
import Cookies from 'cookies'

import isServer from '@utils/isServer'
import {
  GetCookieParams,
  SetCookieParams,
  DeleteCookieParams,
  AuthenticateUserData,
  NextContext,
  AccessTokenData,
  RefreshTokenData,
} from '@typings/utils'

export const JWT_ACCESS_COOKIE_NAME = 'JWTAccess'
export const JWT_REFRESH_COOKIE_NAME = 'JWTRefresh'

export const getCookie = ({
  cookieName,
  ctx,
}: GetCookieParams): string | null | undefined => {
  if (isServer || !!ctx?.req) {
    if (!ctx) {
      throw new Error(
        'The context must be provided when getting cookies on the server side'
      )
    }
    const { req, res } = ctx
    const cookies = new Cookies(req, res)
    return cookies.get(cookieName)
  }
  return cookieCutter.get(cookieName)
}

export const setCookie = ({
  cookieName,
  cookieValue,
  ctx,
}: SetCookieParams): void => {
  if (isServer || !!ctx?.req) {
    if (!ctx) {
      throw new Error(
        'The context must be provided when setting cookies on the server side'
      )
    }
    const { req, res } = ctx
    const cookies = new Cookies(req, res)
    cookies.set(cookieName, cookieValue, {
      httpOnly: true, // true by default
    })
    return
  }
  cookieCutter.set(cookieName, cookieValue)
}

export const deleteCookie = ({ cookieName, ctx }: DeleteCookieParams): void => {
  if (isServer || !!ctx?.req) {
    if (!ctx) {
      throw new Error(
        'The context must be provided when deleting cookies on the server side'
      )
    }
    const { req, res } = ctx
    const cookies = new Cookies(req, res)
    cookies.set(cookieName)
    return
  }
  cookieCutter.set(cookieName, '', { expires: new Date(0) })
}

export const setAccessToken = ({ ctx, access }: AccessTokenData): void => {
  setCookie({
    cookieName: JWT_ACCESS_COOKIE_NAME,
    cookieValue: access,
    ctx,
  })
}

export const setRefreshToken = ({ ctx, refresh }: RefreshTokenData): void => {
  setCookie({
    cookieName: JWT_REFRESH_COOKIE_NAME,
    cookieValue: refresh,
    ctx,
  })
}

export const getAccessToken = ({
  ctx,
}: NextContext): string | null | undefined =>
  getCookie({
    cookieName: JWT_ACCESS_COOKIE_NAME,
    ctx,
  })

export const getRefreshToken = ({
  ctx,
}: NextContext): string | null | undefined =>
  getCookie({
    cookieName: JWT_REFRESH_COOKIE_NAME,
    ctx,
  })

export const deleteAccessToken = ({ ctx }: NextContext): void => {
  deleteCookie({
    cookieName: JWT_ACCESS_COOKIE_NAME,
    ctx,
  })
}

export const deleteRefreshToken = ({ ctx }: NextContext): void => {
  deleteCookie({
    cookieName: JWT_REFRESH_COOKIE_NAME,
    ctx,
  })
}

export const authenticateUser = ({
  access,
  refresh,
  ctx,
}: AuthenticateUserData): void => {
  setAccessToken({ ctx, access })
  setRefreshToken({ ctx, refresh })
}

export const unauthenticateUser = ({ ctx }: NextContext): void => {
  deleteAccessToken({ ctx })
  deleteRefreshToken({ ctx })
}
