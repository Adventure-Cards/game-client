import type { NextPage } from 'next'
import { useEffect, useState } from 'react'

import Nav from '../components/Nav'
import Deck from '../components/Deck'

import { useAdventureDecksForAddress } from '../lib/useAdventureDecksForAddress'

const DEMO_ADDRESS = '0xd17d1BcDe2A28AaDe2b3B5012f93b8B079d0E86B'

const HomePage: NextPage = () => {
  const [address, setAddress] = useState(DEMO_ADDRESS)

  const { data: decks, loading, error, fetch } = useAdventureDecksForAddress()

  useEffect(() => {
    fetch(address)
  }, [address])

  return (
    <div className="relative bg-backgrounddark w-screen min-h-screen p-8">
      <Nav />

      <div className="flex flex-row w-full justify-center items-center mb-12">
        <p className="text-xl mr-2">Find by address: </p>
        <input
          className="text-xl mr-3 bg-backgrounddark px-2 py-1 border border-gray-100"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Address"
        />
      </div>

      {!loading && (
        <div className="flex flex-wrap justify-center gap-12 p-4">
          {decks.map((deck, idx) => (
            <Deck key={idx} deck={deck} idx={idx} />
          ))}
        </div>
      )}
    </div>
  )
}

export default HomePage
