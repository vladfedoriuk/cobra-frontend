import { GenericErrorsData, IDMixin } from '@typings/utils'

export type LoginRequestData = {
  username: string
  password: string
}

export type LoginResponseData = {
  access: string
  refresh: string
}

export type RegisterData = {
  first_name: string
  last_name: string
  email: string
  username: string
}
export type LoginErrorsData = GenericErrorsData

type PasswordsMixin = {
  password: string
  re_password: string
}

type NewPasswordsMixin = {
  new_password: string
  re_new_password: string
}

export type RegisterRequestData = RegisterData & PasswordsMixin

export type RegisterErrorsData = GenericErrorsData

export type RegisterResponseData = RegisterData

export type RefreshTokenRequestData = {
  refresh: string
}

export type RefreshTokenResponseData = {
  access: string
}

type UidAndTokenMixin = {
  uid: string
  token: string
}
export type ActivateRequestData = UidAndTokenMixin

export type ActivateResponseData = Record<string, unknown>

export type ActivateErrorsData = GenericErrorsData

type EmailData = {
  email: string
}
export type ResendActivationRequestData = EmailData

export type ResendActivationResponseData = Record<string, unknown>

export type ResendActivationErrorsData = GenericErrorsData

export type PasswordResetRequestData = EmailData

export type PasswordResetResponseData = Record<string, unknown>

export type PasswordResetErrorsData = GenericErrorsData

export type PasswordResetConfirmRequestData = UidAndTokenMixin &
  NewPasswordsMixin

export type PasswordResetConfirmResponseData = Record<string, unknown>

export type PasswordResetConfirmErrorsData = GenericErrorsData

export type GetProfileResponseData = RegisterData & IDMixin

export type GetProfileErrorData = GenericErrorsData

export type PatchProfileRequestData = RegisterData & IDMixin

export type PatchProfileErrorData = GenericErrorsData

export type PatchProfileResponseData = RegisterData & IDMixin

export type GetUsersResponseData = Array<{
  id: number
  full_name: string
  email: string
  username: string
}>

export type GetUsersErrorsData = GenericErrorsData
