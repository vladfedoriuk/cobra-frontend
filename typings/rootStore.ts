import SnackBarStore from '@stores/snackbar'
import UserStore from '@stores/user'
import { User as UserType } from '@typings/userStore'

export type RootStoreMapKeys = 'user' | 'snackbars'
export type RootStoreMapValues = typeof UserStore | typeof SnackBarStore

export type InitialStoresData = Partial<{
  user: { user: UserType | null }
  snackbars: Record<string, unknown> | null
}>

export interface Stores {
  user: UserStore
  snackbars: SnackBarStore
}
