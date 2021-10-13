import Link from 'next/link'

import { rarityColorKey } from '../../lib/utils'
import { IDeck } from '../../lib/viewer/types'

const Deck = ({ deck }: { deck: IDeck }) => {
  return (
    <Link href={`/deck/${deck.id}`}>
      <div className="flex flex-col w-96 justify-between p-4 bg-background rounded-md shadow-xl cursor-pointer">
        <p className="mb-3">{deck.name}</p>
        {deck.cards.map((card, idx) => (
          <p key={`${deck.id}-${idx}`} className={`text-${rarityColorKey(card.level)}`}>
            {card.name}
          </p>
        ))}
      </div>
    </Link>
  )
}

export default Deck
