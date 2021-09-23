import type { NextPage } from 'next'
import Link from 'next/link'
import { useEffect, useState } from 'react'

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
      <div className="flex flex-col items-center w-full space-y-6 mb-16">
        <h1 className="text-4xl md:text-5xl">Adventure Cards</h1>
        <h3 className="text-xl">{address || 'No wallet selected'}</h3>
      </div>

      <div className="flex flex-col md:flex-row gap-12">
        <div className="flex flex-col w-full md:w-1/2 space-y-4 p-4 bg-background rounded-md shadow-md">
          <p className="max-w-md">Enter a wallet address</p>
          <input
            className="bg-backgrounddark px-2 py-1"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Address"
          />
        </div>

        <div className="flex flex-col w-full md:w-1/2 space-y-4 p-4 bg-background rounded-md shadow-md">
          {error ? (
            <p>{error}</p>
          ) : loading ? (
            <p>Loading...</p>
          ) : decks.length === 0 ? (
            <p>No Adventure Cards!</p>
          ) : (
            decks.map((deck) => (
              <div className="">
                <Link href={`/deck/${deck.id}`}>
                  <a>{deck.id}</a>
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default HomePage
