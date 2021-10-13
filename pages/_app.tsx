import '../styles/globals.css'
import type { AppProps } from 'next/app'

import { DAppProvider } from '@usedapp/core'
import { config } from '../lib/useWallet'

import { Provider } from 'react-redux'
import { store } from '../lib/store'

import { SocketProvider, socket } from '../lib/useSocket'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <DAppProvider config={config}>
        <SocketProvider value={socket}>
          <Component {...pageProps} />
        </SocketProvider>
      </DAppProvider>
    </Provider>
  )
}
