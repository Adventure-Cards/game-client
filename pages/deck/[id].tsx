import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

import { useAdventureCardsForDeck } from '../../lib/useAdventureCardsForDeck'

import Nav from '../../components/Nav'
import Card from '../../components/Card'
import { randomIntFromInterval } from '../../lib/utils'

const DeckPage: NextPage = () => {
  const router = useRouter()
  const { id } = router.query

  const { data: deck, loading, error, fetch } = useAdventureCardsForDeck()

  const [inputId, setInputId] = useState('')

  function handleChangeId(id: string) {
    if (id.length <= 4) {
      setInputId(id)
    }
    if (Number(id) > 0 && id.length <= 4) {
      router.push(`/deck/${id}`)
    }
  }

  function handleClickRandom() {
    const randomId = randomIntFromInterval(1, 4800)
    handleChangeId(String(randomId))
  }

  useEffect(() => {
    setInputId(String(id))
    fetch(Number(id))
  }, [id])

  return (
    <div className="relative bg-backgrounddark w-screen min-h-screen p-8">
      <Nav />

      <div className="flex flex-col md:flex-row md:items-center justify-center w-full gap-6 mb-16">
        <div className="flex items-center md:ml-24">
          <h3 className="text-xl mr-2">Viewing Deck #</h3>
          <input
            className="text-xl w-20 bg-backgrounddark px-2 py-1 border border-gray-100"
            value={inputId}
            onChange={(e) => handleChangeId(e.target.value)}
          />
          <button onClick={handleClickRandom} className="text-xl px-2 py-1 border border-gray-100">
            Random
          </button>
        </div>

        {!loading && (
          <div className="md:ml-24">
            <h3 className="text-xl mr-2">Owned by {`${deck.owner.slice(0, 6)}...${deck.owner.slice(38)}`}</h3>
          </div>
        )}
      </div>

      {!loading && (
        <div className="flex flex-wrap justify-center gap-12 p-4">
          {deck.cards.map((card, idx) => (
            <Card key={idx} card={card} idx={idx} />
          ))}
          {!(Number(id) >= 0 && Number(id) < 8000) && <p>Invalid deckId: {id}</p>}
        </div>
      )}
      <style>{`
        /* Hide scrollbar for Chrome, Safari and Opera */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }

        /* Hide scrollbar for IE, Edge and Firefox */
        .no-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
    </div>
  )
}

export default DeckPage
