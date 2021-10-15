import Link from 'next/link'

import WalletButton from './WalletButton'

export default function Nav() {
  return (
    <div className="relative flex flex-row justify-between items-center w-full mb-16">
      <Link href="/">
        <a className="font-title text-gold text-4xl md:text-5xl">Adventure Cards</a>
      </Link>

      <WalletButton />
    </div>
  )
}
