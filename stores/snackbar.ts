import BaseStore from '@stores/base'
import { SnackBar } from '@typings/snackbarStore'
import { action, computed, makeObservable, observable } from 'mobx'
import { RootStore } from './root'

export default class SnackBarStore extends BaseStore<Record<string, unknown>> {
  snackbars: Array<SnackBar> = []

  constructor(rootStore: Readonly<RootStore>) {
    super(rootStore)
    makeObservable(this, {
      hydrate: action.bound,
      snackbars: observable,
      current: computed,
      toDisplay: computed,
      hide: action,
      prune: action,
      push: action,
    })
  }

  get toDisplay(): Array<SnackBar> {
    return this.snackbars.filter(({ display }) => display)
  }

  get current(): SnackBar | undefined {
    return this.snackbars.find(({ display }) => display)
  }

  hide(): void {
    const snackbarToDispaly = this.current
    if (snackbarToDispaly) {
      const snackbarId = this.snackbars.indexOf(snackbarToDispaly)
      this.snackbars[snackbarId].display = false
    }
  }

  prune(): void {
    this.snackbars = this.toDisplay
  }

  push(snackBarInfo: SnackBar): void {
    this.snackbars.push({ ...snackBarInfo, display: true })
  }
}
