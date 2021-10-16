import { rarityMap, rarityColorKey, toSentenceCase } from '../../lib/utils'
import { useSmartHover } from '../../lib/useSmartHover'
import { usePlaytestGame } from '../../lib/playtest/usePlaytest'

import { IAction, ICard, ActionType, IAbilityAction, CardType, IAbility } from '../../lib/types'

import CardDetail from '../game/CardDetail'

const CardOnBattlefield = ({ card }: { card: ICard }) => {
  const { HoverTrigger, hoverTriggerProps, HoverDetail, hoverDetailProps } = useSmartHover()

  const { game, submitAction } = usePlaytestGame()

  const attackAction = card.actions.find((action) => action.type === ActionType.ATTACK_ACTION)

  const blockActions = card.actions.filter((action) => action.type === ActionType.BLOCK_ACTION)

  function getActionForAbility(ability: IAbility) {
    const action = [...game.player1.actions, ...game.player2.actions]
      .filter((action) => action.type === ActionType.ABILITY_ACTION)
      .filter((action) => (action as IAbilityAction).cardId === card.id)
      .find((action) => (action as IAbilityAction).abilityId === ability.id)

    return action
  }

  function handleClickSubmitActionForAbility(ability: IAbility) {
    const action = getActionForAbility(ability)

    if (action) {
      submitAction(action)
    }
  }

  function handleClickSubmitAction(action: IAction) {
    console.log('submitting action:', action)
    submitAction(action)
  }

  return (
    <>
      <HoverTrigger {...hoverTriggerProps}>
        <div
          className={`flex flex-col justify-between w-36 p-2 bg-background
            rounded-md shadow-xl border-2
            ${card.tapped ? 'transform rotate-6' : ''}
            ${card.attacking ? 'border-blue-400' : `border-${rarityColorKey(card.level)}`}
            `}
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
              {attackAction ? (
                <button
                  className="px-2 py-1 bg-gold border border-gray-200"
                  onClick={() => handleClickSubmitAction(attackAction)}
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
                  onClick={() => handleClickSubmitAction(blockAction)}
                >
                  Block
                </button>
              ))}
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

export default CardOnBattlefield
