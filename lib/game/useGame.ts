import { useSocket } from '../useSocket'
import { useSelector } from '../store'
import { IAction } from '../types'

export function useGame() {
  const game = useSelector((state) => state.game.game)

  const { socket } = useSocket()

  function submitAction(action: IAction) {
    socket.emit('game:action:submit', {
      gameId: game.metadata.id,
      action: action,
    })
  }

  return { game, submitAction }
}
