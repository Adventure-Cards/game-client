import { rarityMap, rarityColorKey, toSentenceCase } from '../../lib/utils'
import { useSmartHover } from '../../lib/useSmartHover'

import { ICard, CardType } from '../../lib/game/types'

import CardDetail from './CardDetail'

const CardInHand = ({ card }: { card: ICard }) => {
  const { parentRef, childRef, handleMouseEnter } = useSmartHover()

  return (
    <div
      ref={parentRef}
      className={`flex flex-col justify-between w-36 h-24 p-2 bg-background
      rounded-md shadow-xl border-2 border-${rarityColorKey(card.level)} has-tooltip`}
      onMouseEnter={handleMouseEnter}
    >
      <div className="flex flex-col space-y-3 overflow-y-scroll no-scrollbar text-xs">
        <p>{card.name}</p>

        <div className="flex flex-row justify-between">
          <p className={`text-${rarityColorKey(card.level)}`}>
            {rarityMap[card.level]} {toSentenceCase(card.type)}
          </p>

          {card.type === CardType.CREATURE && (
            <p>
              {card.attack}/{card.defense}
            </p>
          )}
        </div>
      </div>
      <CardDetail ref={childRef} card={card} />
    </div>
  )
}

export default CardInHand
