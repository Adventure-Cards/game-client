import { rarityMap, rarityColorKey, toSentenceCase } from '../../lib/utils'

import { usePlaytestGame } from '../../lib/playtest/usePlaytest'

import { useSmartHover } from '../../lib/useSmartHover'
import CardDetail from './CardDetail'

import { IAction, ICard, ActionType, CardType } from '../../lib/types'

const CardInHand = ({ card }: { card: ICard }) => {
  const { HoverTrigger, hoverTriggerProps, HoverDetail, hoverDetailProps, visible } = useSmartHover()

  const { submitAction } = usePlaytestGame()

  const castAction = card.actions.find((action) => action.type === ActionType.CAST_ACTION)

  function handleClickSubmitAction(action: IAction) {
    submitAction(action)
  }

  return (
    <>
      <HoverTrigger {...hoverTriggerProps}>
        <div
          className={`flex flex-col justify-between w-36 p-2 bg-background
          rounded-md shadow-xl border-2
          ${castAction ? 'border-gold' : 'border-common'}
          ${visible && 'opacity-0'}
      `}
        >
          <div className="flex flex-col space-y-3 overflow-y-scroll no-scrollbar text-xs">
            <div className="flex flex-row justify-between">
              <p>{card.name}</p>
              <p>{card.cost.amount}</p>
            </div>

            <p className={`text-${rarityColorKey(card.level)}`}>
              {rarityMap[card.level]} {toSentenceCase(card.type)}
            </p>

            <div className="flex flex-row justify-end">
              {card.type === CardType.CREATURE && (
                <p>
                  {card.attack}/{card.defense}
                </p>
              )}
            </div>
          </div>
        </div>
      </HoverTrigger>
      <HoverDetail {...hoverDetailProps}>
        <CardDetail card={card} />
      </HoverDetail>
    </>
  )
}

export default CardInHand
