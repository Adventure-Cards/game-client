import type { NextPage } from 'next'

import Nav from '../../components/core/Nav'

import { usePlaytestLobby } from '../../lib/playtest/usePlaytest'

const PlaytestLobbyPage: NextPage = () => {
  const { createGame } = usePlaytestLobby()

  function handleCreateGame() {
    createGame({
      deckId1: 1234,
      deckId2: 1337,
    })
  }

  return (
    <div className="relative w-screen min-h-screen p-4 md:p-8">
      <Nav />

      <div className="flex flex-col justify-center items-center">
        <button className="px-2 py-1 bg-gold border border-gray-200" onClick={handleCreateGame}>
          Create Game
        </button>
      </div>
    </div>
  )
}

export default PlaytestLobbyPage
