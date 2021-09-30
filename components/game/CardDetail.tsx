import React from 'react'
import { submitAction, useDispatch, useSelector } from '../../lib/store'

import { rarityMap, rarityColorKey, toSentenceCase } from '../../lib/utils'

import { IAction, ICard, ActionType, IAbilityAction, CardType, IAbility } from '../../lib/game/types'

interface CardDetailProps {
  card: ICard
}

const CardDetail = React.forwardRef<HTMLDivElement, CardDetailProps>(({ card }, ref) => {
  const dispatch = useDispatch()

  const game = useSelector((state) => state.game.game)

  const combatAction = useSelector((state) =>
    state.game.game.players[0].availableActions.find(
      (action) =>
        action.type === ActionType.ABILITY_ACTION &&
        action.cardId === card.id &&
        action.abilityId === 'combat'
    )
  )

  function getActionForAbility(ability: IAbility) {
    const action = game.players[0].availableActions
      .filter((action) => action.type === ActionType.ABILITY_ACTION)
      .filter((action) => (action as IAbilityAction).cardId === card.id)
      .find((action) => (action as IAbilityAction).abilityId === ability.id)

    return action
  }

  function handleClickSubmitActionForAbility(ability: IAbility) {
    const action = getActionForAbility(ability)

    if (action) {
      console.log('dispatching action:', action)
      dispatch(submitAction(action))
    }
  }

  function handleClickSubmitAction(action: IAction) {
    dispatch(submitAction(action))
  }

  return (
    <div ref={ref} className="tooltip p-2">
      <div
        className={`flex flex-col justify-between w-72 h-96 p-4 bg-background
          rounded-md shadow-xl border-4 border-${rarityColorKey(card.level)} `}
      >
        <div className="flex flex-col space-y-3 overflow-y-scroll no-scrollbar">
          <p className={``}>{card.name}</p>

          <p className={`text-${rarityColorKey(card.level)}`}>
            {rarityMap[card.level]} {toSentenceCase(card.type)}
          </p>

          {card.abilities.map((ability, idx) => (
            <div key={idx} className="flex flex-col">
              <div className="flex flex-row justify-between items-center pb-2">
                <p className="py-2">{ability.name}</p>
                {getActionForAbility(ability) && (
                  <button
                    className="px-2 py-1 bg-gold border border-gray-200"
                    onClick={() => handleClickSubmitActionForAbility(ability)}
                  >
                    Submit Action
                  </button>
                )}
              </div>

              <p>{ability.description}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-row justify-between">
          {combatAction ? (
            <button
              className="px-2 py-1 bg-gold border border-gray-200"
              onClick={() => handleClickSubmitAction(combatAction)}
            >
              Combat
            </button>
          ) : (
            <div />
          )}

          {card.type === CardType.CREATURE && (
            <p className="py-2">
              {card.attack}/{card.defense}
            </p>
          )}
        </div>
      </div>
    </div>
  )
})

export default CardDetail
