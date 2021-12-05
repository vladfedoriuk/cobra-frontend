import { RootStore } from '@stores/root'

export class BaseStore<T> {
  readonly rootStore: RootStore = null

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore
  }

  hydrate(hydrateData: T): void {
    for (const [k, v] of Object.entries(hydrateData)) {
      this[k] = v
    }
  }
}
