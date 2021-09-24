import { useState } from 'react'
import { request, gql } from 'graphql-request'

import { getCardData } from './getCardData'
import type { IDeck } from './types'

const SUBGRAPH = 'https://api.thegraph.com/subgraphs/name/knav-eth/adventure-cards'

const GET_DECK_BY_ID_QUERY = gql`
  query GetCardsByDeck($deckId: Int) {
    adventureCardPacks(where: { numericId: $deckId }) {
      id
      numericId
      owner
      name
      cards
    }
  }
`

export function useCardsForDeck() {
  const [data, setData] = useState<IDeck>(null!)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const startLoading = () => setLoading(true)
  const stopLoading = () => setLoading(false)

  function fetch(deckId: number) {
    if (!deckId) {
      setData(null!)
      return setError('No id provided')
    }

    startLoading()
    request(SUBGRAPH, GET_DECK_BY_ID_QUERY, { deckId: deckId })
      .then((data) => {
        setData({
          ...data.adventureCardPacks[0],
          cards: data.adventureCardPacks[0].cards.map((card: string) => getCardData(card)),
        })
      })
      .then(stopLoading)
      .catch(setError)
  }

  return { data, loading, error, fetch }
}
