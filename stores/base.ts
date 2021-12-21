import { RootStore } from '@stores/root'

export default abstract class BaseStore<T extends Record<string, unknown>> {
  private readonly rootStore: Readonly<RootStore> = null

  constructor(rootStore: Readonly<RootStore>) {
    this.rootStore = rootStore
  }

  hydrate(hydrateData: NonNullable<T>): void {
    for (const [k, v] of Object.entries(hydrateData)) {
      this[k] = v
    }
  }
}
