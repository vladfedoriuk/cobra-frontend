import App, { AppContext } from 'next/app'
import React from 'react'
import { fetchInitialStoresData } from '@stores/root'
import { MyAppProps } from '@typings/app'
import { MobXStoresProvider } from 'providers/stores'
import createEmotionCache from '@utils/createEmotionCache'
import Head from 'next/head'
import { CacheProvider } from '@emotion/react'
import { ThemeProvider } from '@mui/material/styles'
import theme from '@styles/theme'
import CssBaseline from '@mui/material/CssBaseline'
import { SnackBarProvider } from '@providers/snackbar'
import { DrawerProvider } from '@providers/drawer'
import { getJWTTokens, setAccessToken, setRefreshToken } from '@utils/cookies'
import isServer from '@utils/isServer'

const clientSideEmotionCache = createEmotionCache()

class MyApp extends App<MyAppProps> {
  static async getInitialProps(appContext: AppContext): Promise<any> {
    const initialStoresData = await fetchInitialStoresData(appContext.ctx)
    const appProps = await App.getInitialProps(appContext)
    const [access, refresh] = getJWTTokens({ ctx: appContext.ctx })
    return {
      ...appProps,
      initialStoresData,
      jwtTokens: [access, refresh],
    }
  }

  render(): React.ReactElement {
    const {
      Component,
      pageProps,
      initialStoresData,
      jwtTokens,
      emotionCache = clientSideEmotionCache,
    } = this.props
    const hydrationData = {
      ...initialStoresData,
      ...pageProps.hydrationData,
    }

    if (!isServer) {
      const [clientAccess, clientRefresh] = getJWTTokens({})
      const [serverAccess, serverRefresh] = jwtTokens
      if (
        serverAccess &&
        serverRefresh &&
        hydrationData?.user?.isLoggedIn &&
        (serverAccess !== clientAccess || serverRefresh !== clientRefresh)
      ) {
        setAccessToken({ access: serverAccess })
        setRefreshToken({ refresh: serverRefresh })
      }
    }

    return (
      <CacheProvider value={emotionCache}>
        <Head>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </Head>
        <MobXStoresProvider initialStoresData={hydrationData}>
          <ThemeProvider theme={theme}>
            <DrawerProvider>
              <CssBaseline />
              <SnackBarProvider>
                <Component {...pageProps} />
              </SnackBarProvider>
            </DrawerProvider>
          </ThemeProvider>
        </MobXStoresProvider>
      </CacheProvider>
    )
  }
}

export default MyApp
