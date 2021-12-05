import { UserStore } from '@stores/user'
import { User as UserType } from '@typings/userStore'

export type InitialStoresData = {
  user: UserType | null
}

export type Stores = {
  user: UserStore
}
