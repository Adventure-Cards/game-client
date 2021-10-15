import { rarityMap, rarityColorKey, toSentenceCase } from '../../lib/utils'

import { ICard, CardType } from '../../lib/types'

interface CardDetailProps {
  card: ICard
}

const CardDetail = ({ card }: CardDetailProps) => {
  return (
    <div
      className={`flex flex-col justify-between w-72 h-96 p-4 bg-background
          rounded-md shadow-xl border-4 border-${rarityColorKey(card.level)} `}
    >
      <div className="flex flex-col space-y-3 overflow-y-scroll no-scrollbar">
        <p className={``}>{card.name}</p>

        <p className={`text-${rarityColorKey(card.level)}`}>
          {rarityMap[card.level]} {toSentenceCase(card.type)}
        </p>

        {card.type === CardType.SPELL &&
          card.effects.map((effect, idx) => (
            <div key={idx} className="flex flex-col">
              <div className="flex flex-row justify-between items-center pb-2">
                <p className="py-2">Deal 1 damage to your opponent</p>
              </div>
            </div>
          ))}

        {card.type !== CardType.SPELL &&
          card.abilities.map((ability, idx) => (
            <div key={idx} className="flex flex-col">
              <div className="flex flex-row justify-between items-center pb-2">
                <p className="py-2">{ability.name}</p>
              </div>

              <p>{ability.description}</p>
            </div>
          ))}
      </div>

      <div className="flex flex-row justify-end">
        {card.type === CardType.CREATURE && (
          <p className="py-2">
            {card.attack}/{card.defense}
          </p>
        )}
      </div>
    </div>
  )
}

export default CardDetail
