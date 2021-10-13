import React from 'react'
import { io } from 'socket.io-client'

if (!process.env.NEXT_PUBLIC_API_BASE_URL_WEBSOCKET) {
  throw new Error('base url env var not found')
}

const socket = io(process.env.NEXT_PUBLIC_API_BASE_URL_WEBSOCKET)

const SocketContext = React.createContext(socket)
const SocketProvider = SocketContext.Provider

function useSocket() {
  const socket = React.useContext(SocketContext)

  return { socket }
}

export { socket, SocketProvider, useSocket }
