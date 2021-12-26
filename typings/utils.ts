import { GetServerSidePropsContext, NextPageContext } from 'next'
import { LoginResponseData } from './userApi'

type ContextMixin = { ctx?: NextPageContext | GetServerSidePropsContext }
export type NextContext = ContextMixin
export type GetCookieParams = {
  cookieName: string
} & ContextMixin

export type AuthorizeUserData = LoginResponseData & ContextMixin
export type SetCookieParams = GetCookieParams & { cookieValue: any }
export type DeleteCookieParams = GetCookieParams
export type AccessTokenData = Pick<LoginResponseData, 'access'> & ContextMixin
export type RefreshTokenData = Pick<LoginResponseData, 'refresh'> & ContextMixin
