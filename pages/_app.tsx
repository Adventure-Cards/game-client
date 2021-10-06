import '../styles/globals.css'
import type { AppProps } from 'next/app'

import { Provider } from 'react-redux'
import { store } from '../lib/store'

import { SocketProvider, socket } from '../lib/socket'
import { useSocketConnection } from '../lib/socket/useSocketConnection'

export default function App({ Component, pageProps }: AppProps) {
  useSocketConnection(socket)

  return (
    <Provider store={store}>
      <SocketProvider value={socket}>
        <Component {...pageProps} />
      </SocketProvider>
    </Provider>
  )
}
