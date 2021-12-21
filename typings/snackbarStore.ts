type BaseSnackBar = { message: string; display: boolean }

export type SuccessSnackBar = BaseSnackBar & {
  kind: 'success'
}

export type InfoSnackBar = BaseSnackBar & {
  kind: 'info'
}

export type WarningSnackBar = BaseSnackBar & {
  kind: 'warning'
}

export type ErrorSnackBar = BaseSnackBar & {
  kind: 'error'
}

export type SnackBar =
  | SuccessSnackBar
  | InfoSnackBar
  | WarningSnackBar
  | ErrorSnackBar

export const snackbar = (message: string, kind: SnackBar['kind']): SnackBar =>
  ({
    kind,
    message,
    display: true,
  } as SnackBar)
