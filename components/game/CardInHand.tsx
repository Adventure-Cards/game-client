import { rarityMap, rarityColorKey, toSentenceCase } from '../../lib/utils'
import { useSmartHover } from '../../lib/useSmartHover'
import { submitAction, useDispatch, useSelector } from '../../lib/store'

import { IAction, ICard, ActionType, CardType } from '../../lib/game/types'

import CardDetail from './CardDetail'

const CardInHand = ({ card }: { card: ICard }) => {
  const { HoverTrigger, hoverTriggerProps, HoverDetail, hoverDetailProps } = useSmartHover()

  const dispatch = useDispatch()

  const castAction = useSelector((state) =>
    state.game.game.players[0].availableActions.find(
      (action) => action.type === ActionType.CAST_ACTION && action.cardId === card.id
    )
  )

  function handleClickSubmitAction(action: IAction) {
    dispatch(submitAction(action))
  }

  return (
    <>
      <HoverTrigger {...hoverTriggerProps}>
        <div
          className={`flex flex-col justify-between w-36 p-2 bg-background
          rounded-md shadow-xl border-2 border-${rarityColorKey(card.level)} `}
        >
          <div className="flex flex-col space-y-3 overflow-y-scroll no-scrollbar text-xs">
            {castAction && (
              <button
                className="px-2 py-1 bg-gold border border-gray-200"
                onClick={() => handleClickSubmitAction(castAction)}
              >
                Cast
              </button>
            )}

            <div className="flex flex-row justify-between">
              <p>{card.name}</p>
              <p className={`text-${getColorForManaColor(card.cost.color)}`}>{card.cost.amount}</p>
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

export function getColorForManaColor(color: string) {
  switch (color) {
    case 'white':
      return 'white'
    case 'blue':
      return 'blue-600'
    case 'black':
      return 'black'
    case 'red':
      return 'red-700'
    case 'green':
      return 'green-700'
    default:
      throw new Error(`unhandled color: ${color}`)
  }
}
