import '../styles/globals.css'
import type { AppProps } from 'next/app'

import { Provider } from 'react-redux'
import { store } from '../lib/store'

import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <DndProvider backend={HTML5Backend}>
        <Component {...pageProps} />
      </DndProvider>
    </Provider>
  )
}
