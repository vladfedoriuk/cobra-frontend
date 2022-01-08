import { GetServerSidePropsContext, NextPageContext } from 'next'
import { LoginResponseData } from './userApi'
import { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar'

type ContextMixin = { ctx?: NextPageContext | GetServerSidePropsContext }
export type NextContext = ContextMixin
export type GetCookieParams = {
  cookieName: string
} & ContextMixin

export type AuthenticateUserData = LoginResponseData & ContextMixin
export type SetCookieParams = GetCookieParams & { cookieValue: any }
export type DeleteCookieParams = GetCookieParams
export type AccessTokenData = Pick<LoginResponseData, 'access'> & ContextMixin
export type RefreshTokenData = Pick<LoginResponseData, 'refresh'> & ContextMixin
export interface AppBarProps extends MuiAppBarProps {
  open?: boolean
}

export type IDMixin = {
  id: number
}

export type GenericErrorsData =
  | {
      [k: string]: string | string[]
    }
  | string[]
