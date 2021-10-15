import { useSocket } from '../socket/useSocket'
import { useSelector } from '../store'

export function useLobby() {
  const lobby = useSelector((state) => state.lobby)

  const { socket } = useSocket()

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
