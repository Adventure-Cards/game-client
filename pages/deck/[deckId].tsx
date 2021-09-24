import type { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

import { useDispatch, useSelector } from '../../lib/hooks'
import { updateDeckId, updateCardIdx } from '../../lib/store'
import { useCardsForDeck } from '../../lib/useCardsForDeck'

import Nav from '../../components/Nav'
import Card from '../../components/Card'
import { rarityColorKey, randomIntFromInterval, isNumeric } from '../../lib/utils'

const DeckPage: NextPage = () => {
  const router = useRouter()
  const { deckId: pathDeckId } = router.query

  const dispatch = useDispatch()
  const deckId = useSelector((state) => state.app.deckId)
  const cardIdx = useSelector((state) => state.app.cardIdx)

  const { data: deck, loading, fetch } = useCardsForDeck()

  function handleChangeDeckId(id: string) {
    if (isNumeric(id) && id.length <= 4) {
      const deckIdAsNumber = Number(id)
      dispatch(updateDeckId(deckIdAsNumber))
      // weird bug if the path is set to empty string
      if (deckIdAsNumber > 0) {
        router.push(`/deck/${id}`)
      }
    }
  }

  function handleClickRandom() {
    const randomId = randomIntFromInterval(1, 4800)
    handleChangeDeckId(String(randomId))
  }

  useEffect(() => {
    // when the path changes (by user or when it becomes defined)
    // kick off the fetch function
    const pathDeckIdAsNumber = Number(pathDeckId)
    dispatch(updateDeckId(pathDeckIdAsNumber))
    fetch(pathDeckIdAsNumber)
  }, [pathDeckId])

  return (
    <div className="relative w-screen min-h-screen p-4 md:p-8">
      <Nav />

      <div className="flex flex-col md:flex-row md:items-center justify-center w-full gap-6 mb-16">
        <div className="flex items-center">
          <h3 className="text-xl mr-2">Viewing Deck #</h3>
          <input
            className="text-xl w-20 bg-backgrounddark px-2 py-1 border border-gray-100"
            value={deckId ? deckId : ''}
            onChange={(e) => handleChangeDeckId(e.target.value)}
          />
          <button onClick={handleClickRandom} className="text-xl px-2 py-1 border border-gray-100">
            Random
          </button>
        </div>

        {!loading && (
          <div className="md:ml-24 text-xl">
            Owned by{' '}
            <Link href={`/address/${deck.owner}`}>
              <a className="underline">{`${deck.owner.slice(0, 6)}...${deck.owner.slice(38)}`}</a>
            </Link>
          </div>
        )}
      </div>

      {/* {!loading && (
        <div className="flex flex-row mb-16">
          <div className="w-2/3 flex flex-col md:flex-row md:flex-wrap ">
            {deck.cards.map((card, idx) => (
              <p
                key={idx}
                className={`w-1/2 text-${rarityColorKey(card.level)} cursor-pointer
                ${cardIdx === idx && 'bg-gray-200'}
                `}
                onClick={() => dispatch(updateCardIdx(idx))}
              >
                {idx + 1} &nbsp; {card.name}
              </p>
            ))}
          </div>

          <div className="w-1/3 flex justify-center">
            <Card key={'active'} card={deck.cards[cardIdx]} />
          </div>
        </div>
      )} */}

      {!loading && (
        <div className="flex flex-wrap justify-center gap-8">
          {deck.cards.map((card, idx) => (
            <Card key={idx} card={card} />
          ))}
          {!(Number(deckId) >= 0 && Number(deckId) < 8000) && <p>Invalid deckId: {deckId}</p>}
        </div>
      )}
    </div>
  )
}

export default DeckPage
