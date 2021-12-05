import React from 'react'

import { RootStoreContext } from '@providers/stores'

const useMobXStores = (): React.ContextType<typeof RootStoreContext> =>
  React.useContext(RootStoreContext)

export default useMobXStores
