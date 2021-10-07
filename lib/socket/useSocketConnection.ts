import { useEffect } from 'react'
import { Socket } from 'socket.io-client'

export function useSocketConnection(socket: Socket) {
  useEffect(() => {
    function handleConnect() {
      console.log(`connected to socket: ${socket.id}`)
    }

    socket.on('connect', handleConnect)
    return () => {
      socket.off('connect', handleConnect)
    }
  }, [])
}
