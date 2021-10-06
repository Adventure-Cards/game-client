import type { NextPage } from 'next'
import { useEffect } from 'react'

import { useDispatch, useSelector, updateAddress } from '../../lib/store'
import { createGame, joinGame } from '../../lib/socket/actions'

import { useLobby } from '../../lib/socket/useLobby'
import { ILobbyGameStatus } from '../../lib/store'

const LobbyPage: NextPage = () => {
  const dispatch = useDispatch()
  const address = useSelector((state) => state.app.address)

  const lobby = useLobby()

  function handleCreateGame() {
    createGame({
      address: address,
    })
  }

  function handleJoinGame(gameId: string) {
    joinGame({
      address: address,
      gameId: gameId,
    })
  }

  function handleChangeAddress(address: string) {
    dispatch(updateAddress(address))
  }

  // hack to show a human-readable/editable player id
  useEffect(() => {
    dispatch(updateAddress('123'))
  }, [])

  return (
    <div className="relative w-screen min-h-screen p-4 md:p-8">
      <div className="w-full h-full flex flex-col md:flex-row gap-24 md:gap-6">
        <div className="w-full md:w-1/3 flex flex-col items-start gap-4">
          <p className="text-lg">
            address: &nbsp; &nbsp;
            <input
              className="text-xl bg-backgrounddark px-2 py-1 border border-gray-100"
              value={address}
              onChange={(e) => handleChangeAddress(e.target.value)}
              placeholder="Address"
            />
          </p>

          <p className="text-lg">My Games</p>

          <button onClick={handleCreateGame}>Create Game</button>

          <div className="w-full grid grid-cols-6 gap-2">
            <div className="col-span-2">id</div>
            <div className="col-span-2">players</div>
            <div className="col-span-2">status</div>

            {lobby.games
              .filter((game) => game.playerIds.includes(address))
              .map((game) => (
                <>
                  <div className="col-span-2">{game.id.slice(0, 5)}...</div>
                  <div className="col-span-2 flex flex-col gap-1">
                    {game.playerIds.map((address) => (
                      <p>
                        {address.length > 10 ? `${address.slice(0, 6)}...${address.slice(38, 42)}` : address}
                      </p>
                    ))}
                  </div>
                  <div className="col-span-2">{game.status}</div>
                </>
              ))}
          </div>
        </div>

        <div className="flex flex-col items-start gap-4 w-full md:w-1/3">
          <p className="text-lg">Join a Game</p>

          <div className="w-full grid grid-cols-6 gap-2">
            <div className="col-span-2">id</div>
            <div className="col-span-2">players</div>
            <div className="col-span-2"></div>

            {lobby.games
              .filter(
                (game) => !game.playerIds.includes(address) && game.status === ILobbyGameStatus.NOT_STARTED
              )
              .map((game) => (
                <>
                  <div className="col-span-2">{game.id.slice(0, 5)}...</div>
                  <div className="col-span-2 flex flex-col gap-1">
                    {game.playerIds.map((address) => (
                      <p>
                        {address.length > 10 ? `${address.slice(0, 6)}...${address.slice(38, 42)}` : address}
                      </p>
                    ))}
                  </div>
                  <div className="col-span-2 flex justify-end">
                    <button
                      className="px-2 py-1 bg-gold border border-gray-200"
                      onClick={() => handleJoinGame(game.id)}
                    >
                      Join
                    </button>
                  </div>
                </>
              ))}
          </div>
        </div>

        <div className="flex flex-col items-start gap-4 w-full md:w-1/3">
          <p className="text-lg">Games in progress</p>

          <div className="w-full grid grid-cols-6 gap-2">
            <div className="col-span-2">id</div>
            <div className="col-span-2">players</div>
            <div className="col-span-2">status</div>

            {lobby.games
              .filter((game) => !game.playerIds.includes(address) && game.status === ILobbyGameStatus.STARTED)
              .map((game) => (
                <>
                  <div className="col-span-2">{game.id.slice(0, 6)}...</div>
                  <div className="col-span-2 flex flex-col gap-1">
                    {game.playerIds.map((address) => (
                      <p>
                        {address.length > 10 ? `${address.slice(0, 6)}...${address.slice(38, 42)}` : address}
                      </p>
                    ))}
                  </div>
                  <div className="col-span-2">{game.status}</div>
                </>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LobbyPage
