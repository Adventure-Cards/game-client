import { useState } from 'react'
import { request, gql } from 'graphql-request'

import { ICardData, getCardData } from './getCardData'

const SUBGRAPH = 'https://api.thegraph.com/subgraphs/name/knav-eth/adventure-cards'

export interface IAdventureCardDeck {
  id: number
  numericId: number
  owner: string
  name: string
  cards: ICardData[]
}

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

export function useAdventureCardsForDeck() {
  const [data, setData] = useState<IAdventureCardDeck>(null!)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const startLoading = () => setLoading(true)
  const stopLoading = () => setLoading(false)

  function fetch(deckId: number) {
    if (!deckId) {
      setData(null!)
      return setError('No id provided')
    }

    console.log('about to fetch')

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
