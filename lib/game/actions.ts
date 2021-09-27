import {
  Game,
  Player,
  Card,
  Action,
  ActionType,
  EffectType,
  AbilityAction,
  CostTarget,
  CostItem,
} from './types'

import { validateCostItem, processCostItem } from './costs'

export function updateAvailableActionsForPlayers(initialGame: Game): Game {
  let game = { ...initialGame }

  for (const player of game.players) {
    let availableActions: Action[] = []

    const cardActions = player.deck.map((card) => getActionsForCard(game, player, card)).flat()

    availableActions = [...availableActions, ...cardActions]

    if (game.hasPriority === player.id) {
      const releasePriorityAction: Action = {
        type: ActionType.PRIORITY_ACTION,
        controllerId: player.id,
        costItems: [],
        effects: [
          {
            type: EffectType.RELEASE_PRIORITY,
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

function getActionsForCard(game: Game, player: Player, card: Card) {
  const actions: AbilityAction[] = []

  for (const ability of card.abilities) {
    // put together CostItems
    const costItems: CostItem[] = []

    for (const cost of ability.costs) {
      switch (cost.target) {
        case CostTarget.PLAYER:
          costItems.push({
            cost: cost,
            target: cost.target,
            playerId: player.id,
          })
          break
        case CostTarget.CARD:
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

    // validate that costItems can be paid
    let payable = true
    for (const costItem of costItems) {
      if (!validateCostItem(game, costItem)) {
        payable = false
        break
      }
    }
    if (!payable) {
      break
    }

    actions.push({
      type: ActionType.ABILITY_ACTION,
      cardId: card.id,
      controllerId: player.id,
      costItems: costItems,
      effects: ability.effects,
    })
  }

  return actions
}

export function submitAction(initialGame: Game, action: Action): Game {
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

  // add effects to the stack (TODO be more precise about the order they get added)
  for (const effect of action.effects) {
    game.stack.push({
      controllerId: action.controllerId,
      effect: effect,
    })
  }

  // update available actions to reflect changes made while paying costs
  game = updateAvailableActionsForPlayers(game)

  return game
}
