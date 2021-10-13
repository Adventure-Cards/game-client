import { useRouter } from 'next/router'
import { useEffect } from 'react'

import { useSocket } from '../useSocket'
import { useDispatch, updateLobby, ILobbyState } from '../store'

export function useLobbyConnection() {
  const router = useRouter()

  const dispatch = useDispatch()

  const { socket } = useSocket()

  useEffect(() => {
    function handleLobbyUpdate(data: any) {
      const lobby = validateLobbyData(data)
      dispatch(updateLobby(lobby))
    }

    function handleGameStart(data: any) {
      const gameId = validateGameStartData(data)
      router.push(`/game/${gameId}`)
    }

    socket.on('lobby:update', handleLobbyUpdate)
    socket.on('game:start', handleGameStart)

    return () => {
      socket.off('lobby:update', handleLobbyUpdate)
      socket.off('game:start', handleGameStart)
    }
  }, [socket])
}

// TODO
function validateLobbyData(data: any): ILobbyState {
  return data as ILobbyState
}

function validateGameStartData(data: any): string {
  return data as string
}
