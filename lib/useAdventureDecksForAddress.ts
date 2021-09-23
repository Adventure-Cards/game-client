import { useState } from 'react'
import { request, gql } from 'graphql-request'

const SUBGRAPH = 'https://api.thegraph.com/subgraphs/name/knav-eth/adventure-cards'

interface IAdventureCardDeck {
  id: number
  numericId: number
  owner: string
  name: string
  cards: string[]
}

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

export function useAdventureDecksForAddress() {
  const [data, setData] = useState<IAdventureCardDeck[]>([])
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
      .then((data) => setData(data.adventureCardPacks))
      .then(stopLoading)
      .catch(setError)
  }

  return { data, loading, error, fetch }
}
