import {
  InitialStoresData,
  RootStoreMapKeys,
  RootStoreMapValues,
  Stores,
} from '@typings/rootStore'
import UserStore from '@stores/user'
import SnackBarStore from '@stores/snackbar'
import ProjectStore from '@stores/project'
import UserApi from '@api/user'
import { NextContext } from '@typings/utils'
import { convertUserData } from '@utils/user'

const StoreClassesMap = new Map<RootStoreMapKeys, RootStoreMapValues>([
  ['user', UserStore],
  ['snackbars', SnackBarStore],
  ['projects', ProjectStore],
])

export class RootStore {
  constructor() {
    StoreClassesMap.forEach(
      (StoreClass, storeName) => (this[storeName] = new StoreClass(this))
    )
  }

  private __filterNullableProps<T extends Record<string, unknown>>(
    data: T
  ): NonNullable<T> {
    return Object.entries(data).reduce((newObj, [key, value]) => {
      if (value !== null) {
        Object.assign(newObj, { [key]: value })
      }
      return newObj
    }, {} as NonNullable<T>)
  }

  hydrate(hidrateStoresData: InitialStoresData): void {
    StoreClassesMap.forEach((_, storeName) => {
      if (hidrateStoresData[storeName] !== null) {
        this[storeName].hydrate(
          this.__filterNullableProps(hidrateStoresData[storeName])
        )
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

export const fetchInitialStoresData = async (
  ctx: NextContext['ctx'] = null
): Promise<InitialStoresData> => {
  // You can do anything to fetch initial store state

  const userApi = new UserApi()
  let profileData = null

  if (await userApi.isAuthenticated(ctx)) {
    await UserApi.withErrorsHandling(
      userApi
        .getProfile(ctx)
        .then(({ data }) => (profileData = convertUserData(data)))
    )
  }
  return {
    user: { user: profileData },
    snackbars: null,
    projects: null,
  }
}
