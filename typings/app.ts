import type { AppProps } from 'next/app'
import { InitialStoresData } from '@typings/rootStore'

export type MyAppProps = AppProps & {
  initialStoresData: InitialStoresData
}
