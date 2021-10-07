import { useEffect } from 'react'
import { useWallet as _useWallet } from 'use-wallet'

import { useSelector, useDispatch, updateAddress, updateConnected } from '../lib/store'

export function useWallet() {
  const dispatch = useDispatch()
  const address = useSelector((state) => state.app.address)

  const wallet = _useWallet()

  useEffect(() => {
    // if wallet is already connected, update states and return
    if (wallet.status === 'connected' && wallet.account) {
      dispatch(updateAddress(wallet.account))
      dispatch(updateConnected(true))
      localStorage.setItem('address', wallet.account)
      return
    }

    // if address is found in localStorage, try to reconnect then return
    const foundAddress = localStorage.getItem('address')
    if (foundAddress && foundAddress !== '') {
      dispatch(updateAddress(foundAddress))

      // // attempt programmatic reconnection with foundAddress...
      // wallet.connect('injected')
      // dispatch(updateConnected(true))
      // localStorage.setItem('address', wallet.account)

      return
    }

    // no connection or found address, give up
    dispatch(updateConnected(false))
    localStorage.removeItem('address')
  }, [wallet.status])

  return wallet
}
