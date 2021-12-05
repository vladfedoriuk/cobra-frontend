import { InitialStoresData, Stores } from '@typings/rootStore'
import { UserStore } from '@stores/user'

const StoreClassesMap = new Map([['user', UserStore]])

export class RootStore {
  readonly user: UserStore

  constructor() {
    StoreClassesMap.forEach(
      (StoreClass, storeName) => (this[storeName] = new StoreClass(this))
    )
  }

  hydrate(hidrateStoresData: InitialStoresData): void {
    StoreClassesMap.forEach((_, storeName) => {
      if (hidrateStoresData[storeName] !== null) {
        this[storeName].hydrate(hidrateStoresData[storeName])
      }
    })
  }

  get stores(): Stores {
    return Array.from(StoreClassesMap).reduce(
      (obj, [key, _]) => Object.assign(obj, { [key]: this[key] }),
      {} as Stores
    )
  }
}

export const fetchInitialStoresData = async (): Promise<InitialStoresData> => {
  // You can do anything to fetch initial store state
  return {
    user: null,
  }
}
