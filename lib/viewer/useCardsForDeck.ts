import { useState } from 'react'
import { request, gql } from 'graphql-request'

import type { IDeck } from './types'

const SUBGRAPH = `${process.env.NEXT_PUBLIC_API_BASE_URL}/graphql`

const GET_DECK_BY_ID_QUERY = gql`
  query GetDeck($mintId: Int!) {
    deck(mintId: $mintId) {
      mintId
      owner
      cards {
        name
        level
        type
      }
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
    request(SUBGRAPH, GET_DECK_BY_ID_QUERY, { mintId: deckId })
      .then((data) => {
        setData(data.deck)
      })
      .then(stopLoading)
      .catch(setError)
  }

  return { data, loading, error, fetch }
}
