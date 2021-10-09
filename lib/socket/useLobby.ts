import { useRouter } from 'next/router'
import { useEffect } from 'react'

import { useSocket } from '../../lib/socket'
import { useDispatch, useSelector, updateLobby, ILobbyState } from '../../lib/store'

export function useLobby() {
  const router = useRouter()

  const dispatch = useDispatch()
  const lobby = useSelector((state) => state.lobby)

  const socket = useSocket()

  useEffect(() => {
    function handleLobbyUpdate(data: any) {
      const lobby = validateLobbyData(data)
      dispatch(updateLobby(lobby))
    }

    function handleGameStart(data: any) {
      console.log('received game:start, redirecting to /game/{gameId}')
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

  function createGame({ address }: { address: string }) {
    socket.emit('lobby:game:create', {
      address: address,
    })
  }

  function joinGame({ address, gameId }: { address: string; gameId: string }) {
    socket.emit('lobby:game:join', {
      address: address,
      gameId: gameId,
    })
  }

  function readyGame({ address, gameId, deckId }: { address: string; gameId: string; deckId: number }) {
    socket.emit('lobby:game:ready', {
      address: address,
      gameId: gameId,
      deckId: deckId,
    })
  }

  return { lobby, createGame, joinGame, readyGame }
}

// TODO
function validateLobbyData(data: any): ILobbyState {
  return data as ILobbyState
}

function validateGameStartData(data: any): string {
  return data as string
}
