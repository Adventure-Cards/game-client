import type { NextPage } from 'next'
import Head from 'next/head'
import { useState, useEffect } from 'react'

import Nav from '../../components/core/Nav'

import { useLobby } from '../../lib/lobby/useLobby'
import { IGameMetadata, IGameStatus } from '../../lib/lobby/slice'

import { shortenAddress } from '@usedapp/core'
import { useWallet } from '../../lib/useWallet'

const LobbyPage: NextPage = () => {
  const { connected, address } = useWallet()

  const { lobby, createGame, joinGame, readyGame } = useLobby()

  const [playerGames, setPlayerGames] = useState<IGameMetadata[]>([])
  const [otherGames, setOtherGames] = useState<IGameMetadata[]>([])

  useEffect(() => {
    setPlayerGames(
      Object.values(lobby.games).filter((game) =>
        game.players.map((player) => player.address).includes(address)
      )
    )
  }, [lobby.games, address])

  useEffect(() => {
    setOtherGames(
      Object.values(lobby.games).filter(
        (game) => !connected || !game.players.map((player) => player.address).includes(address)
      )
    )
  }, [lobby.games])

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

  function handleJoinGameDummy(gameId: string) {
    joinGame({
      address: '0x544b031F366e2b3E2b60Eb32c697098C7f5Bd018',
      gameId: gameId,
    })
  }

  function handleReadyGame(gameId: string) {
    readyGame({
      address: address,
      gameId: gameId,
      deckId: 1053,
    })
  }

  function handleReadyGameDummy(gameId: string) {
    readyGame({
      address: '0x544b031F366e2b3E2b60Eb32c697098C7f5Bd018',
      gameId: gameId,
      deckId: 4749,
    })
  }

  return (
    <>
      <Head>
        <title>Lobby - Adventure Cards</title>
      </Head>
      <div className="relative w-screen min-h-screen p-4 md:p-8">
        <Nav />

        <div className="w-full flex flex-col md:flex-row gap-24 md:gap-6">
          <div className="w-full md:w-1/3 flex flex-col items-start gap-4">
            {connected && (
              <>
                {playerGames.length === 0 && (
                  <button className="px-2 py-1 bg-gold border border-gray-200" onClick={handleCreateGame}>
                    Create Game
                  </button>
                )}

                <p className="text-lg">My Games</p>

                <div className="w-full grid grid-cols-6 gap-2">
                  <div className="col-span-2">id</div>
                  <div className="col-span-2">players</div>
                  <div className="col-span-2">status</div>

                  {playerGames.map((game) => (
                    <>
                      <div className="col-span-2 flex flex-col gap-1">
                        {game.players.map((player, idx) => (
                          <p key={idx}>{shortenAddress(player.address)}</p>
                        ))}
                      </div>
                      <div className="col-span-2">{game.status}</div>
                      <button
                        className="col-span-2 px-2 py-1 bg-gold border border-gray-200"
                        onClick={() => handleJoinGameDummy(game.id)}
                      >
                        Join Dummy
                      </button>
                      {game.status === IGameStatus.PLAYERS_JOINED && (
                        <button
                          className="col-span-2 px-2 py-1 bg-gold border border-gray-200"
                          onClick={() => handleReadyGame(game.id)}
                        >
                          Ready
                        </button>
                      )}
                      {game.status === IGameStatus.PLAYERS_JOINED && (
                        <button
                          className="col-span-2 px-2 py-1 bg-gold border border-gray-200"
                          onClick={() => handleReadyGameDummy(game.id)}
                        >
                          Ready Dummy
                        </button>
                      )}
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

              {otherGames
                .filter(
                  (game) =>
                    !game.players.map((player) => player.address).includes(address) &&
                    game.status === IGameStatus.NOT_STARTED
                )
                .map((game) => (
                  <>
                    <div className="col-span-2">{game.id.slice(0, 5)}...</div>
                    <div className="col-span-2 flex flex-col gap-1">
                      {game.players.map((player, idx) => (
                        <p key={idx}>
                          {player.address.length > 10
                            ? `${player.address.slice(0, 6)}...${player.address.slice(38, 42)}`
                            : player.address}
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

              {otherGames.map((game) => (
                <>
                  <div className="col-span-2">{game.id.slice(0, 6)}...</div>
                  <div className="col-span-2 flex flex-col gap-1">
                    {game.players.map((player, idx) => (
                      <p key={idx}>
                        {player.address.length > 10
                          ? `${player.address.slice(0, 6)}...${player.address.slice(38, 42)}`
                          : player.address}
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
    </>
  )
}

export default LobbyPage
