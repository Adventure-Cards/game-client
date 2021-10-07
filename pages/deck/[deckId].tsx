import type { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

import { useDispatch, useSelector, updateDeckId } from '../../lib/store'
import { useCardsForDeck } from '../../lib/useCardsForDeck'

import Nav from '../../components/Nav'
import Card from '../../components/Card'
import type { IDeck } from '../../lib/types'
import { rarityMap, randomIntFromInterval, isNumeric, toSentenceCase } from '../../lib/utils'

const DeckPage: NextPage = () => {
  const router = useRouter()
  const { deckId: pathDeckId } = router.query

  const dispatch = useDispatch()
  const deckId = useSelector((state) => state.app.deckId)
  const cardIdx = useSelector((state) => state.app.cardIdx)

  const { data: deck, fetch } = useCardsForDeck()

  useEffect(() => {
    // when the path changes (by user or when it becomes defined)
    // kick off the fetch function
    const pathDeckIdAsNumber = Number(pathDeckId)
    dispatch(updateDeckId(pathDeckIdAsNumber))
    fetch(pathDeckIdAsNumber)
  }, [pathDeckId])

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

  return (
    <div className="relative w-screen min-h-screen p-4 md:p-8">
      <Nav />

      <div className="flex flex-wrap justify-center gap-12 md:gap-24 mb-16">
        <div className="flex flex-col gap-3">
          <h3>Deck #</h3>
          <div>
            <input
              className="w-20 bg-backgrounddark px-2 py-1 border border-gray-100"
              value={deckId ? deckId : ''}
              onChange={(e) => handleChangeDeckId(e.target.value)}
            />
            <button onClick={handleClickRandom} className="px-2 py-1 border border-gray-100">
              Random
            </button>
          </div>
          {!(Number(deckId) >= 0 && Number(deckId) < 4888) && <p>Invalid deckId: {deckId}</p>}
          {deck && (
            <Link href={`/play/${deck.id}`}>
              <a className="underline">Playtest</a>
            </Link>
          )}
        </div>

        {deck && (
          <>
            <div className="flex flex-col">
              <h3 className="pb-3">Owner</h3>
              <Link href={`/address/${deck.owner}`}>
                <a className="underline">{`${deck.owner.slice(0, 6)}...${deck.owner.slice(38)}`}</a>
              </Link>
            </div>
            <CardLevelDetails deck={deck} />
            <CardTypeDetails deck={deck} />{' '}
          </>
        )}
      </div>

      {deck && (
        <div className="flex flex-wrap justify-center gap-8">
          {deck.cards.map((card, idx) => (
            <Card key={idx} card={card} />
          ))}
        </div>
      )}
    </div>
  )
}

export default DeckPage

function CardLevelDetails({ deck }: { deck: IDeck }) {
  const levels = [0, 1, 2, 3]

  return (
    <div>
      <h4 className="pb-3">Rarity </h4>
      <div className="flex flex-row">
        <div className="flex flex-col pr-5">
          {levels.map((level, idx) => (
            <p key={idx}>{rarityMap[level]}</p>
          ))}
        </div>
        <div className="flex flex-col">
          {levels.map((level, idx) => (
            <p key={idx}>{deck.cards.filter((card) => card.level === level).length}</p>
          ))}
        </div>
      </div>
    </div>
  )
}

function CardTypeDetails({ deck }: { deck: IDeck }) {
  const types = ['creature', 'artifact', 'enchantment', 'spell']

  return (
    <div>
      <h4 className="pb-3">Card Types </h4>
      <div className="flex flex-row">
        <div className="flex flex-col pr-5">
          {types.map((type, idx) => (
            <p key={idx}>{toSentenceCase(type)}s</p>
          ))}
        </div>
        <div className="flex flex-col">
          {types.map((type, idx) => (
            <div key={idx} className="flex flex-row">
              <p>{deck.cards.filter((card) => card.type === type).length}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
