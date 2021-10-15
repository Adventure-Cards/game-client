import { useEffect } from 'react'

import { ChainId, useEthers, useLookupAddress } from '@usedapp/core'

import { useDispatch } from './store'

export const config = {
  readOnlyChainId: ChainId.Mainnet,
}

export function useWallet() {
  const dispatch = useDispatch()

  const { active, account } = useEthers()
  const ens = useLookupAddress()

  return { connected: active, address: account || '', ens: ens || '' }
}
