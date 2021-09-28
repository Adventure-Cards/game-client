import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

import { useDispatch, useSelector } from '../../lib/hooks'
import { updateAddress } from '../../lib/store'
import { useDecksForAddress } from '../../lib/useDecksForAddress'

import Nav from '../../components/Nav'
import DeckPreview from '../../components/DeckPreview'
import images from '../../data/images'

const AddressPage: NextPage = () => {
  const router = useRouter()
  const { address: pathAddress } = router.query

  const dispatch = useDispatch()
  const address = useSelector((state) => state.app.address)

  const { data: decks, loading, fetch } = useDecksForAddress()

  function handleChangeAddress(address: string) {
    if (true) {
      dispatch(updateAddress(address))
      // weird bug if the path is set to empty string
      if (address.length === 42) {
        router.push(`/address/${address}`)
      }
    }
  }

  useEffect(() => {
    if (typeof pathAddress === 'string') {
      dispatch(updateAddress(pathAddress))
      fetch(pathAddress)
    }
  }, [pathAddress])

  return (
    <div className="relative w-screen min-h-screen p-4 md:p-8">
      <Nav />

      <div className="flex flex-col md:flex-row md:items-center justify-center w-full gap-6 mb-16">
        <p className="text-xl md:mr-2">Find by address: </p>
        <input
          className="text-xl bg-backgrounddark px-2 py-1 border border-gray-100"
          value={address}
          onChange={(e) => handleChangeAddress(e.target.value)}
          placeholder="Address"
        />
      </div>

      {!loading && (
        <div className="flex flex-wrap justify-center gap-12 md:p-4">
          {decks.map((deck, idx) => (
            <DeckPreview key={idx} deck={deck} images={images} />
          ))}
        </div>
      )}
    </div>
  )
}

export default AddressPage
