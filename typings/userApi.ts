export type LoginRequestData = {
  username: string
  password: string
}

export type LoginResponseData = {
  access: string
  refresh: string
}

type GenericErrorsData = {
  [k: string]: string | string[]
}

export type RegisterData = {
  first_name: string
  last_name: string
  email: string
  username: string
}
export type LoginErrorsData = GenericErrorsData

export type RegisterRequestData = RegisterData & {
  password: string
  re_password: string
}

export type RegisterErrorsData = GenericErrorsData

export type RegisterResponseData = RegisterData

export type RefreshTokenRequestData = {
  refresh: string
}

export type RefreshTokenResponseData = {
  access: string
}
