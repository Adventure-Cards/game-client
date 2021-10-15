import { useState } from 'react'
import { request, gql } from 'graphql-request'

import type { IDeck } from './types'

const SUBGRAPH = 'https://api.thegraph.com/subgraphs/name/knav-eth/adventure-cards'

const GET_DECKS_BY_OWNER_QUERY = gql`
  query GetDecksByOwner($owner: String) {
    adventureCardPacks(where: { owner: $owner }) {
      id
      numericId
      owner
      name
      cards
    }
  }
`

export function useDecksForAddress() {
  const [data, setData] = useState<IDeck[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const startLoading = () => setLoading(true)
  const stopLoading = () => setLoading(false)

  function fetch(address: string) {
    setError('')

    if (!address) {
      setData([])
      return setError('No address provided')
    }

    if (address.length !== 42) {
      setData([])
      return setError('Invalid address')
    }

    startLoading()
    request(SUBGRAPH, GET_DECKS_BY_OWNER_QUERY, { owner: address })
      .then((data) => {
        setData(
          data.adventureCardPacks.map((deck: any) => ({
            ...deck,
            mintId: deck.numericId,
          }))
        )
      })
      .then(stopLoading)
      .catch(setError)
  }

  return { data, loading, error, fetch }
}
