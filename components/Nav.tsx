import Link from 'next/link'

export default function Nav() {
  return (
    <div className="relative flex flex-row justify-between items-center w-full mb-16">
      <Link href="/">
        <a className="font-title text-gold text-4xl md:text-5xl">Adventure Cards</a>
      </Link>

      {/* <div className="flex items-center">
        <h3 className="text-xl">Connect Wallet</h3>
      </div> */}
    </div>
  )
}
