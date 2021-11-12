import { useMemo } from 'react'
import { usePlaytestGame } from '../../lib/playtest/usePlaytest'
import { useDispatch, useSelector } from '../../lib/store'
import {
  setSelectingTargets,
  setSelectingTargetsForCard,
  setSelectingTargetsForAction,
} from '../../lib/playtest/slice'

import { rarityMap, rarityColorKey, toSentenceCase } from '../../lib/utils'

import { ICard, ActionType, CardType } from '../../lib/types'

const CardInHand = ({ card }: { card: ICard }) => {
  const { submitAction } = usePlaytestGame()

  const dispatch = useDispatch()
  const { selectingTargets } = useSelector((state) => state.playtest)

  const castAction = card.actions.find((action) => action.type === ActionType.CAST_ACTION)

  const handleClick = () => {
    console.log(castAction)

    if (!castAction || castAction.type !== ActionType.CAST_ACTION) {
      return
    }

    if (!castAction.arguments) {
      // no args, cast immediately
      submitAction(castAction)
      return
    }

    // get empty arguments
    const emptyArguments = Object.keys(castAction.arguments).filter(
      (key) => castAction.arguments![key] === null
    )

    if (emptyArguments.length === 0) {
      // no args required, cast immediately
      submitAction(castAction)
      return
    }

    if (emptyArguments.includes('target')) {
      // target arg required, enter select targets flow
      dispatch(setSelectingTargets(true))
      dispatch(setSelectingTargetsForCard(card))
      dispatch(setSelectingTargetsForAction(castAction))
    }
  }

  const castReady = useMemo(() => {
    if (selectingTargets) {
      return false
    }
    return !!castAction
  }, [selectingTargets, castAction])

  return (
    <>
      <div
        className={`flex flex-col justify-between w-36 p-2 bg-background
        rounded-md shadow-xl border-2
        ${castReady ? 'border-gold cursor-pointer' : 'border-common'}
      `}
        onClick={handleClick}
      >
        <div className="flex flex-col space-y-3 overflow-y-scroll no-scrollbar text-xs">
          <div className="flex flex-row justify-between">
            <p>{card.name}</p>
            <p>{card.cost}</p>
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
    </>
  )
}

export default CardInHand
