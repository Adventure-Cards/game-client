import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

import { useDispatch, useSelector } from '../store'
import { updatePlaytestGame } from './slice'
import { useSocket } from '../useSocket'

import { IAction, IGameStateForPlaytest } from '../types'

export function usePlaytestLobby() {
  const router = useRouter()

  const { socket } = useSocket()

  useEffect(() => {
    function handleGameStart(data: any) {
      const gameId = validateGameStartData(data)
      router.push(`/playtest/${gameId}`)
    }

    socket.on('playtest:game:start', handleGameStart)

    return () => {
      socket.off('playtest:game:start', handleGameStart)
    }
  }, [socket])

  function createGame({ deckId1, deckId2 }: { deckId1: number; deckId2: number }) {
    socket.emit('playtest:game:create', {
      deckId1: deckId1,
      deckId2: deckId2,
    })
  }

  return { createGame }
}

function validateGameStartData(data: any): string {
  return data as string
}

export function usePlaytestGameConnection() {
  const router = useRouter()
  const { gameId: pathGameId } = router.query

  const dispatch = useDispatch()
  const { socket } = useSocket()

  const [hasReceivedGameUpdate, setHasReceivedGameUpdate] = useState(false)

  useEffect(() => {
    // try to join the game room when socket or address change
    if (socket && pathGameId && !hasReceivedGameUpdate) {
      console.log('emitting game:join with:', { pathGameId })
      socket.emit('playtest:game:join', {
        gameId: pathGameId,
      })
    }

    // handle game updates
    function handleGameUpdate(data: any) {
      dispatch(updatePlaytestGame(validatePlaytestGameData(data)))
      setHasReceivedGameUpdate(true)
    }

    socket.on('playtest:game:update', handleGameUpdate)
    return () => {
      socket.off('playtest:game:update', handleGameUpdate)
    }
  }, [socket.connected, pathGameId])
}

// TODO
function validatePlaytestGameData(data: any): IGameStateForPlaytest {
  return data as IGameStateForPlaytest
}

export function usePlaytestGame() {
  const game = useSelector((state) => state.playtest.game)

  const { socket } = useSocket()

  function submitAction(action: IAction) {
    socket.emit('game:action:submit', {
      gameId: game.metadata.id,
      action: action,
    })
  }

  return { game, submitAction }
}
