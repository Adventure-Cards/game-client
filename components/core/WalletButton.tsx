import React from 'react'

import { useEthers, useLookupAddress, shortenAddress } from '@usedapp/core'

export default function WalletButton() {
  const { account, activateBrowserWallet, deactivate } = useEthers()
  const ens = useLookupAddress()

  return (
    <div>
      {account ? (
        <button
          className="flex flex-col items-center px-2 py-2 border border-green-600 rounded-md"
          onClick={() => deactivate()}
        >
          {ens ?? shortenAddress(account)}
        </button>
      ) : (
        <button
          className="flex flex-col items-center px-2 py-2 border border-yellow-600 rounded-md"
          onClick={() => activateBrowserWallet()}
        >
          Connect Wallet
        </button>
      )}
    </div>
  )
}
