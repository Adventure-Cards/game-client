import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

import { useDispatch } from '../store'
import { updateGame } from './slice'
import { useWallet } from '../useWallet'
import { useSocket } from '../useSocket'

import { IGameStateForPlayer } from '../types'

export function useGameConnection() {
  const router = useRouter()
  const { gameId: pathGameId } = router.query

  const dispatch = useDispatch()
  const { socket } = useSocket()
  const { address } = useWallet()

  const [hasReceivedGameUpdate, setHasReceivedGameUpdate] = useState(false)

  useEffect(() => {
    // try to join the game room when socket or address change
    if (socket && pathGameId && address && !hasReceivedGameUpdate) {
      console.log('emitting game:join with:', { pathGameId, address })
      socket.emit('game:join', {
        gameId: pathGameId,
        address: address,
      })
    }

    // handle game updates
    function handleGameUpdate(data: any) {
      dispatch(updateGame(validateGameData(data)))
      setHasReceivedGameUpdate(true)
    }

    socket.on('game:update', handleGameUpdate)
    return () => {
      socket.off('game:update', handleGameUpdate)
    }
  }, [socket.connected, address, pathGameId])
}

// TODO
function validateGameData(data: any): IGameStateForPlayer {
  return data as IGameStateForPlayer
}
