import { BaseStore } from '@stores/base'
import { action, makeObservable, observable } from 'mobx'
import { RootStore } from '@stores/root'
import { User as UserType } from '@typings/userStore'

export class UserStore extends BaseStore<UserType> {
  user: UserType = null

  constructor(rootStore: RootStore) {
    super(rootStore)
    makeObservable(this, {
      user: observable,
      setUser: action.bound,
    })
  }

  setUser(userData: UserType): void {
    this.user = userData
  }
}
