import { GetServerSidePropsContext, NextPageContext } from 'next'

export type GetCookieParams = {
  cookieName: string
  ctx?: NextPageContext | GetServerSidePropsContext
}
export type SetCookieParams = GetCookieParams & { cookieValue: any }
export type DeleteCookieParams = GetCookieParams
