import { socket } from './index'

export function createGame({ address }: { address: string }) {
  socket.emit('game:create', {
    address: address,
  })
}

export function joinGame({ address, gameId }: { address: string; gameId: string }) {
  socket.emit('game:join', {
    address: address,
    gameId: gameId,
  })
}
