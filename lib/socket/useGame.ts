import { useEffect } from 'react'

import { useSocket } from './index'
import { useDispatch, useSelector, updateGame } from '../store'
import { IAction, IGameStateForPlayer } from '../newTypes'

export function useGame() {
  const dispatch = useDispatch()
  const game = useSelector((state) => state.game.game)

  const socket = useSocket()

  useEffect(() => {
    function handleGameUpdate(data: any) {
      const game = validateGameData(data)
      dispatch(updateGame(game))
    }
    socket.on('game:update', handleGameUpdate)
    return () => {
      socket.off('game:update', handleGameUpdate)
    }
  }, [socket])

  function submitAction(action: IAction) {
    socket.emit('game:action:submit', {
      gameId: game.metadata.id,
      action: action,
    })
  }

  return { game, submitAction }
}

// TODO
function validateGameData(data: any): IGameStateForPlayer {
  return data as IGameStateForPlayer
}
