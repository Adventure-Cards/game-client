import { useEffect } from 'react'

import { useSocket } from '../../lib/socket'
import { useDispatch, useSelector, updateLobby, ILobbyState } from '../../lib/store'

export function useLobby() {
  const dispatch = useDispatch()
  const lobby = useSelector((state) => state.lobby)

  const socket = useSocket()

  useEffect(() => {
    function handleLobbyUpdate(data: any) {
      const lobby = validateLobbyData(data)
      dispatch(updateLobby(lobby))
    }
    socket.on('lobby:update', handleLobbyUpdate)
    return () => {
      socket.off('lobby:update', handleLobbyUpdate)
    }
  }, [socket])

  return lobby
}

// TODO
function validateLobbyData(data: any): ILobbyState {
  return data as ILobbyState
}
