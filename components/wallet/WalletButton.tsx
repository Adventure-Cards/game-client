import React, { useState, createRef } from 'react'

import { useWallet } from '../../lib/useWallet'
import { useOnClickOutside } from '../../lib/useOnClickOutside'
import { prettyPrintAddress } from '../../lib/utils'

export default function WalletButton() {
  const wallet = useWallet()

  const [showing, setShowing] = useState(false)

  const modalRef = createRef<HTMLDivElement>()
  useOnClickOutside(modalRef, () => setShowing(false))

  return (
    <>
      <div>
        {wallet.status === 'connected' ? (
          <button
            className="flex flex-col items-center px-2 py-2 border border-green-600 rounded-md"
            onClick={() => setShowing(true)}
          >
            {prettyPrintAddress(wallet.account || '')}
          </button>
        ) : (
          <button
            className="flex flex-col items-center px-2 py-2 border border-yellow-600 rounded-md"
            onClick={() => setShowing(true)}
          >
            Connect Wallet
          </button>
        )}
      </div>

      {showing && (
        <div
          className="fixed z-50 inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto
        h-full w-full flex justify-center items-center"
        >
          <div ref={modalRef} className="flex flex-col items-center p-24 bg-gray-900 rounded-lg">
            {wallet.status === 'connected' ? (
              <button
                className="px-2 py-1 bg-gold border border-gray-200"
                onClick={() => {
                  console.log('sending wallet reset')
                  wallet.reset()
                  setShowing(false)
                }}
              >
                Disconnect
              </button>
            ) : (
              <button
                className="px-2 py-1 bg-gold border border-gray-200"
                onClick={() => {
                  wallet.connect('injected')
                  setShowing(false)
                }}
              >
                Connect via MetaMask
              </button>
            )}
          </div>
        </div>
      )}
    </>
  )
}
