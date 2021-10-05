import { rarityMap, rarityColorKey, toSentenceCase } from '../../lib/utils'
import { submitAction, useDispatch } from '../../lib/store'

import { useSmartHover } from '../../lib/useSmartHover'
import CardDetail from './CardDetail'

import { IAction, ICard, ActionType, CardType } from '../../lib/game/types'

const CardInHand = ({ card }: { card: ICard }) => {
  const { HoverTrigger, hoverTriggerProps, HoverDetail, hoverDetailProps } = useSmartHover()

  const dispatch = useDispatch()

  const castAction = card.actions.find((action) => action.type === ActionType.CAST_ACTION)

  function handleClickSubmitAction(action: IAction) {
    dispatch(submitAction(action))
  }

  return (
    <>
      <HoverTrigger {...hoverTriggerProps}>
        <div
          className={`flex flex-col justify-between w-36 p-2 bg-background
        rounded-md shadow-xl border-2 ${
          castAction ? 'border-blue-400 cursor-grab' : 'border-common cursor-pointer'
        }
      `}
        >
          {castAction && (
            <button
              className="px-2 py-1 bg-gold border border-gray-200"
              onClick={() => handleClickSubmitAction(castAction)}
            >
              Cast
            </button>
          )}
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
