import cookieCutter from 'cookie-cutter'
import Cookies from 'cookies'

import isServer from '@utils/isServer'
import {
  GetCookieParams,
  SetCookieParams,
  DeleteCookieParams,
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
