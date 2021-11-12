import { useMemo } from 'react'
import { usePlaytestGame } from '../../lib/playtest/usePlaytest'
import { useDispatch, useSelector } from '../../lib/store'
import { selectTarget } from '../../lib/playtest/slice'

import { rarityMap, rarityColorKey, toSentenceCase } from '../../lib/utils'

import { ICard, ActionType, CardType } from '../../lib/types'

const CardOnBattlefield = ({ card }: { card: ICard }) => {
  const { submitAction } = usePlaytestGame()

  const dispatch = useDispatch()
  const { selectingTargets, selectingTargetsForCard, target } = useSelector((state) => state.playtest)

  const attackAction = card.actions.find((action) => action.type === ActionType.ATTACK_ACTION)
  const blockActions = card.actions.filter((action) => action.type === ActionType.BLOCK_ACTION)

  const isValidTarget = useMemo(() => {
    if (selectingTargets) {
      return true
    } else {
      return false
    }
  }, [selectingTargets, selectingTargetsForCard])

  const handleClick = () => {
    if (isValidTarget) {
      dispatch(selectTarget(card.id))
    }
  }

  return (
    <div
      className={`flex flex-col justify-between w-36 p-2 bg-background
        rounded-md shadow-xl border-2
        ${card.tapped ? 'transform rotate-6' : ''}
        ${card.activeAttack ? 'transform -translate-x-3' : ''}
        ${isValidTarget ? 'cursor-pointer border-red-500' : `border-common`}
        ${target === card.id && 'border-green-500'}
      `}
      onClick={handleClick}
    >
      <div className="flex flex-col space-y-3 overflow-y-scroll no-scrollbar text-xs">
        <div className="flex flex-row justify-between">
          <p>{card.name}</p>
        </div>

        <p className={`text-${rarityColorKey(card.level)}`}>
          {rarityMap[card.level]} {toSentenceCase(card.type)}
        </p>

        <div className="flex flex-row justify-between items-center">
          {attackAction ? (
            <button
              className="px-2 py-1 bg-gold border border-gray-200"
              onClick={() => submitAction(attackAction)}
            >
              Attack
            </button>
          ) : (
            <div />
          )}

          {card.type === CardType.CREATURE && (
            <p>
              {card.attack}/{card.defense}
            </p>
          )}
        </div>

        <div className="flex flex-row justify-between items-center">
          {blockActions.map((blockAction) => (
            <button
              className="px-2 py-1 bg-gold border border-gray-200"
              onClick={() => submitAction(blockAction)}
            >
              Block
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CardOnBattlefield
