import Link from 'next/link'

import { rarityMap } from '../lib/utils'
import { IAdventureCardDeck } from '../lib/useAdventureCardsForDeck'

const Deck = ({ deck, idx }: { deck: IAdventureCardDeck; idx: number }) => {
  return (
    <Link href={`/deck/${deck.id}`}>
      <div className="flex flex-col w-96 justify-between p-4 bg-background rounded-md shadow-xl cursor-pointer">
        <p className="mb-3">{deck.name}</p>
        {deck.cards.map((card) => (
          <p key={idx} className={`text-${rarityMap[card.level].toLowerCase()}`}>
            {card.name}
          </p>
        ))}
      </div>
    </Link>
  )
}

export default Deck
