import { socket } from './index'

export function createGame({ address }: { address: string }) {
  socket.emit('lobby:game:create', {
    address: address,
  })
}

export function joinGame({ address, gameId }: { address: string; gameId: string }) {
  socket.emit('lobby:game:join', {
    address: address,
    gameId: gameId,
  })
}
