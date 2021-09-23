import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Link from 'next/link'

import { useAdventureCardsForDeck } from '../../lib/useAdventureCardsForDeck'

import Card from '../../components/Card'
import { useEffect } from 'react'

const DeckPage: NextPage = () => {
  const router = useRouter()
  const { id } = router.query

  const { data: deck, loading, error, fetch } = useAdventureCardsForDeck()

  useEffect(() => {
    fetch(Number(id))
  }, [id])

  if (loading || error) {
    return null
  }

  return (
    <div className="relative bg-backgrounddark w-screen min-h-screen p-8">
      <div className="relative flex flex-col items-center w-full space-y-6 mb-16">
        <h1 className="text-4xl md:text-5xl">Adventure Cards</h1>
        <div className="flex space-x-8">
          <Link href="/">
            <a className="text-xl underline">Home</a>
          </Link>
          <h3 className="text-xl">Deck #{id}</h3>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-12 p-4">
        {deck.cards.map((card, idx) => (
          <Card key={idx} card={card} idx={idx} />
        ))}
      </div>
    </div>
  )
}

export default DeckPage
