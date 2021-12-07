export type LoginRequestData = {
  username: string
  password: string
}

export type LoginResponseData = {
  access: string
  refresh: string
}

export type LoginErrorsData = {
  [k: string]: string | string[]
}

export type RefreshTokenRequestData = {
  refresh: string
}

export type RefreshTokenResponseData = {
  access: string
}
