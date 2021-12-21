import {
  InitialStoresData,
  RootStoreMapKeys,
  RootStoreMapValues,
  Stores,
} from '@typings/rootStore'
import UserStore from '@stores/user'
import SnackBarStore from '@stores/snackbar'

const StoreClassesMap = new Map<RootStoreMapKeys, RootStoreMapValues>([
  ['user', UserStore],
  ['snackbars', SnackBarStore],
])

export class RootStore {
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
    snackbars: null,
  }
}
