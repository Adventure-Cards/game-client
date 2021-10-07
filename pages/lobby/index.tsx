import type { NextPage } from 'next'

import Nav from '../../components/Nav'

import { useSelector } from '../../lib/store'
import { createGame, joinGame } from '../../lib/socket/actions'

import { useLobby } from '../../lib/socket/useLobby'
import { ILobbyGameStatus } from '../../lib/store'

import { prettyPrintAddress } from '../../lib/utils'

const LobbyPage: NextPage = () => {
  const address = useSelector((state) => state.app.address)
  const connected = useSelector((state) => state.app.connected)

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

  return (
    <div className="relative w-screen min-h-screen p-4 md:p-8">
      <Nav />

      <div className="w-full flex flex-col md:flex-row gap-24 md:gap-6">
        <div className="w-full md:w-1/3 flex flex-col items-start gap-4">
          {connected && (
            <>
              {lobby.games.filter((game) => game.playerIds.includes(address)).length === 0 && (
                <button className="px-2 py-1 bg-gold border border-gray-200" onClick={handleCreateGame}>
                  Create Game
                </button>
              )}

              <p className="text-lg">My Games</p>

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
                          <p>{prettyPrintAddress(address)}</p>
                        ))}
                      </div>
                      <div className="col-span-2">{game.status}</div>
                    </>
                  ))}
              </div>
            </>
          )}
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
