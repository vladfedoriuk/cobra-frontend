import App, { AppContext } from 'next/app'
import React from 'react'
import { fetchInitialStoresData } from '@stores/root'
import { MyAppProps } from '@typings/app'
import { MobXStoresProvider } from 'providers/stores'

class MyApp extends App<MyAppProps> {
  static async getInitialProps(appContext: AppContext): Promise<any> {
    const initialStoresData = await fetchInitialStoresData()
    const appProps = await App.getInitialProps(appContext)
    return {
      ...appProps,
      initialStoresData,
    }
  }

  render(): React.ReactElement {
    const { Component, pageProps, initialStoresData } = this.props
    const hydrationData = {
      ...pageProps.hydrationData,
      ...initialStoresData,
    }
    return (
      <MobXStoresProvider initialStoresData={hydrationData}>
        <Component />
      </MobXStoresProvider>
    )
  }
}

export default MyApp
