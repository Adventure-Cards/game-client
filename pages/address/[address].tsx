import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

import { useDecksForAddress } from '../../lib/viewer/useDecksForAddress'

import Nav from '../../components/core/Nav'
import DeckPreview from '../../components/viewer/DeckPreview'
import images from '../../data/images'

const DEFAULT_ADDRESS = '0xd17d1BcDe2A28AaDe2b3B5012f93b8B079d0E86B'

const AddressPage: NextPage = () => {
  const router = useRouter()
  const { address: pathAddress } = router.query

  const { data: decks, loading, fetch } = useDecksForAddress()

  const [lookupAddress, setLookupAddress] = useState(DEFAULT_ADDRESS)

  function handleChangeAddress(event: React.ChangeEvent<HTMLInputElement>) {
    setLookupAddress(event.target.value)

    if (event.target.value.length === 42) {
      router.push(`/address/${event.target.value}`)
    }
  }

  useEffect(() => {
    fetch(lookupAddress)
  }, [lookupAddress])

  useEffect(() => {
    if (typeof pathAddress === 'string') {
      fetch(pathAddress)
    }
  }, [pathAddress])

  return (
    <>
      <Head>
        <title>Address {pathAddress} - Adventure Cards</title>
      </Head>
      <div className="relative w-screen min-h-screen p-4 md:p-8">
        <Nav />

        <div className="flex flex-col md:flex-row md:items-center justify-center w-full gap-6 mb-16">
          <p className="text-xl md:mr-2">Find by address: </p>
          <input
            className="text-xl bg-backgrounddark px-2 py-1 border border-gray-100"
            value={lookupAddress}
            placeholder="Address"
            onChange={handleChangeAddress}
            onFocus={(event) => event.target.select()}
            onBlur={(event) => {
              if (event.target.value.length === 0) {
                setLookupAddress(DEFAULT_ADDRESS)
              }
            }}
          />
        </div>

        {!loading && (
          <div className="flex flex-wrap justify-center gap-12 md:p-4">
            {decks.length === 0 && <p>No Decks!</p>}

            {decks.map((deck, idx) => (
              <DeckPreview key={idx} deck={deck} images={images} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default AddressPage
