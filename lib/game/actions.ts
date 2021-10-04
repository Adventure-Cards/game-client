import {
  IGame,
  IPlayer,
  ICard,
  IAction,
  ActionType,
  EffectType,
  Target,
  ICostItem,
  IEffectItem,
  EffectExecutionType,
  AbilitySpeed,
  Phase,
  CardType,
  CostType,
  EffectItemType,
  CardLocation,
} from './types'

import { processEffectItem } from './effects'
import { validateCostItem, processCostItem } from './costs'

export function updateAvailableActionsForPlayers(initialGame: IGame): IGame {
  let game = { ...initialGame }

  for (const player of game.players) {
    let availableActions: IAction[] = []

    const cardActions = player.deck.map((card) => getActionsForCard(game, player, card)).flat()

    availableActions = [...availableActions, ...cardActions]

    if (game.hasPriority === player.id && game.stack.length === 0) {
      const releasePriorityAction: IAction = {
        type: ActionType.PRIORITY_ACTION,
        controllerId: player.id,
        costItems: [],
        effectItems: [
          {
            type: EffectItemType.CORE,
            controllerId: player.id,
            effect: { type: EffectType.RELEASE_PRIORITY, executionType: EffectExecutionType.IMMEDIATE },
          },
        ],
      }
      availableActions = [...availableActions, releasePriorityAction]
    }

    // add effect actions here (look at top effect on stack and see if belongs to player?)

    player.availableActions = availableActions
  }

  return game
}

function getActionsForCard(game: IGame, player: IPlayer, card: ICard) {
  const actions: IAction[] = []

  // handle casting ability
  if (game.phase === Phase.MAIN && card.location === CardLocation.HAND && game.stack.length === 0) {
    const castCostItem: ICostItem = {
      target: Target.PLAYER,
      playerId: player.id,
      cost: card.cost,
    }

    if (validateCostItem(game, castCostItem)) {
      actions.push({
        type: ActionType.CAST_ACTION,
        cardId: card.id,
        controllerId: player.id,
        costItems: [castCostItem],
        effectItems: [
          {
            type: EffectItemType.CAST,
            controllerId: player.id,
            effect: {
              executionType: EffectExecutionType.RESPONDABLE,
              type: EffectType.CAST,
            },
            cardId: card.id,
          },
        ],
      })
    }
  }

  // handle activated abilities
  if (card.type === CardType.SPELL) {
    return actions
  }

  for (const ability of card.abilities) {
    // validate card is on battlefield
    if (card.location !== CardLocation.BATTLEFIELD) {
      continue
    }

    // validate ability speed
    let speedOk = true
    switch (ability.speed) {
      case AbilitySpeed.NORMAL:
        if (game.hasPriority !== player.id || game.phase !== Phase.MAIN) {
          speedOk = false
        }
        break
      case AbilitySpeed.INSTANT:
        if (game.hasPriority !== player.id || game.phase === Phase.DRAW) {
          speedOk = false
        }
        break
      default:
        throw new Error(`unhandled ability speed`)
    }
    if (!speedOk) {
      continue
    }

    // prepare and validate cost items
    const costItems: ICostItem[] = []
    for (const _cost of ability.costs) {
      const cost = { ..._cost }

      switch (cost.target) {
        case Target.PLAYER:
          costItems.push({
            cost: cost,
            target: cost.target,
            playerId: player.id,
          })
          break
        case Target.CARD:
          costItems.push({
            cost: cost,
            target: cost.target,
            cardId: card.id,
          })
          break
        default:
          throw new Error(`unhandled cost target`)
      }
    }

    let canAffordCosts = true
    for (const costItem of costItems) {
      if (!validateCostItem(game, costItem)) {
        canAffordCosts = false
        break
      }
    }
    if (!canAffordCosts) {
      continue
    }

    // prepare and submit effect items
    const effectItems: IEffectItem[] = []

    for (const _effect of ability.effects) {
      const effect = { ..._effect }

      switch (effect.type) {
        case EffectType.MANA_ADD:
          effectItems.push({
            type: EffectItemType.CORE,
            controllerId: player.id,
            effect: effect,
          })
          break
        case EffectType.DAMAGE_ANY:
          effectItems.push({
            type: EffectItemType.WITH_AMOUNT,
            controllerId: player.id,
            effect: effect,
            amount: 1,
          })
          break
        default:
          throw new Error(`unhandled EffectType: ${effect.type}`)
      }
    }

    actions.push({
      type: ActionType.ABILITY_ACTION,
      abilityId: ability.id,
      cardId: card.id,
      controllerId: player.id,
      costItems: costItems,
      effectItems: effectItems,
    })
  }

  // handle combat ability
  if (card.type === CardType.CREATURE && game.hasPriority === player.id && game.phase === Phase.COMBAT) {
    const combatCostItem: ICostItem = {
      cost: { target: Target.CARD, type: CostType.TAP },
      target: Target.CARD,
      cardId: card.id,
    }

    if (validateCostItem(game, combatCostItem)) {
      actions.push({
        type: ActionType.COMBAT_ACTION,
        cardId: card.id,
        controllerId: player.id,
        costItems: [combatCostItem],
        effectItems: [
          {
            type: EffectItemType.WITH_AMOUNT,
            controllerId: player.id,
            effect: {
              executionType: EffectExecutionType.RESPONDABLE,
              type: EffectType.DAMAGE_PLAYER,
              target: Target.PLAYER,
            },
            amount: card.attack,
          },
        ],
      })
    }
  }

  return actions
}

export function submitAction(initialGame: IGame, action: IAction): IGame {
  let game = { ...initialGame }

  // validate that costItems can be paid
  for (const costItem of action.costItems) {
    if (!validateCostItem(game, costItem)) {
      console.error(`
        oh no! you tried to submit an action that had costItems
        you could not pay for. that isnt supposed to happen!
      `)
      return game
    }
  }

  // execute costs immediately (they never get added to the stack, just like MTG!)
  for (const costItem of action.costItems) {
    game = processCostItem(game, costItem)
  }

  // handle effects based on execution type
  for (const effectItem of action.effectItems) {
    switch (effectItem.effect.executionType) {
      case EffectExecutionType.IMMEDIATE:
        game = processEffectItem(game, effectItem)
        break
      case EffectExecutionType.RESPONDABLE:
        // if its a casting action, must set card location to STACK
        if (action.type === ActionType.CAST_ACTION) {
          const cards = game.players[0].deck.filter((card) => card.id === action.cardId)
          if (cards.length === 0) {
            throw new Error(`unable to find card with cardId ${action.cardId}`)
          }
          if (cards.length > 1) {
            throw new Error('found multiple cards with the same id')
          }
          cards[0].location = CardLocation.STACK
        }

        game.stack.push({
          controllerId: action.controllerId,
          effectItem: effectItem,
        })
        break
      default:
        throw new Error('unhandled effect execution type')
    }
  }

  // update available actions to reflect changes made while paying costs
  // and possible effects added to stack
  game = updateAvailableActionsForPlayers(game)

  return game
}
