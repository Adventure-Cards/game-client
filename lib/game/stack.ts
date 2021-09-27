import { Game } from './types'

import { updateAvailableActionsForPlayers } from './actions'
import { processEffect } from './effects'

export function processStackItem(initialGame: Game) {
  let game = { ...initialGame }

  // the purpose of this function is to pop the top StackItem
  // and process the effect

  // effects can:
  // 1) mutate player and card objects
  // 2) update the game phase
  // 3) create more effects

  const stackItem = game.stack.pop()

  if (stackItem) {
    processEffect(game, stackItem.controllerId, stackItem.effect)
  }

  // after processing a stack item, need to refresh the available actions
  // for each player, because the game state has changed
  game = updateAvailableActionsForPlayers(game)

  return game
}
