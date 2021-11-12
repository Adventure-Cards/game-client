import { ChainId, useEthers, useLookupAddress } from '@usedapp/core'

export const config = {
  readOnlyChainId: ChainId.Mainnet,
}

export function useWallet() {
  const { active, account } = useEthers()
  const ens = useLookupAddress()

  return { connected: active, address: account || '', ens: ens || '' }
}
