import { RootStore } from '@stores/root'
import { InitialStoresData, Stores } from '@typings/rootStore'
import isServer from '@utils/isServer'

import { enableStaticRendering } from 'mobx-react-lite'
import React from 'react'

enableStaticRendering(isServer)

let rootStore: RootStore = null

export const initializeRootStore = (
  initialStoresData: InitialStoresData
): RootStore => {
  const _store = rootStore ?? new RootStore()

  _store.hydrate(initialStoresData)

  if (isServer) return _store

  if (!rootStore) rootStore = _store

  return _store
}

export const RootStoreContext = React.createContext<Stores>(undefined)

export const MobXStoresProvider: React.FC<{
  initialStoresData: InitialStoresData
}> = ({ children, initialStoresData }) => {
  const store = initializeRootStore(initialStoresData)
  const value = store.stores
  return (
    <RootStoreContext.Provider value={value}>
      {children}
    </RootStoreContext.Provider>
  )
}
