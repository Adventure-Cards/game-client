import { rarityMap, rarityColorKey, toSentenceCase } from '../../lib/utils'
import { useSmartHover } from '../../lib/useSmartHover'
import { submitAction, useDispatch, useSelector } from '../../lib/store'

import { IAction, ICard, ActionType, IAbilityAction, CardType, IAbility } from '../../lib/game/types'

import CardDetail from './CardDetail'

const CardOnBattlefield = ({ card }: { card: ICard }) => {
  const { parentRef, childRef, handleMouseEnter } = useSmartHover()

  const dispatch = useDispatch()

  const game = useSelector((state) => state.game.game)

  const combatAction = useSelector((state) =>
    state.game.game.players[0].availableActions.find(
      (action) => action.type === ActionType.COMBAT_ACTION && action.cardId === card.id
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
      dispatch(submitAction(action))
    }
  }

  function handleClickSubmitAction(action: IAction) {
    dispatch(submitAction(action))
  }

  return (
    <div
      ref={parentRef}
      className={`has-tooltip flex flex-col justify-between w-36 p-2 bg-background
        rounded-md shadow-xl border-2 border-${rarityColorKey(card.level)} `}
      onMouseEnter={handleMouseEnter}
    >
      <div className="flex flex-col space-y-3 overflow-y-scroll no-scrollbar text-xs">
        <div className="flex flex-row justify-between">
          <p>{card.name}</p>
        </div>

        <p className={`text-${rarityColorKey(card.level)}`}>
          {rarityMap[card.level]} {toSentenceCase(card.type)}
        </p>

        {card.type !== CardType.SPELL &&
          card.abilities.map((ability, idx) => (
            <div key={idx} className="flex flex-col">
              <div className="flex flex-row justify-between items-center">
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

        <div className="flex flex-row justify-between items-center">
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

export default CardOnBattlefield