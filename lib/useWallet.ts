import { useEffect } from 'react'

import { ChainId, useEthers, useLookupAddress } from '@usedapp/core'

import { useDispatch, updateAddress, updateConnected } from './store'

export const config = {
  readOnlyChainId: ChainId.Mainnet,
}

export function useWallet() {
  const dispatch = useDispatch()

  const { active, account } = useEthers()
  const ens = useLookupAddress()

  // most of the app should prefer useWallet to read the address
  // but for e.g. the address page, still want to support user-supplied address
  // and this will update the user-suppled address on connection.
  useEffect(() => {
    if (account) {
      dispatch(updateAddress(account))
    } else {
      dispatch(updateAddress(''))
    }
  }, [active])

  return { connected: active, address: account, ens }
}
