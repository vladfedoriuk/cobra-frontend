import type { AppProps } from 'next/app'
import { InitialStoresData } from '@typings/rootStore'
import { EmotionCache } from '@emotion/cache'

export type MyAppProps = AppProps & {
  initialStoresData: InitialStoresData
  emotionCache: EmotionCache
  jwtTokens: Array<string>
}
