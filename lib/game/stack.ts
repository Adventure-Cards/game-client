import { IGame } from './types'

import { processEffectItem } from './effects'

export function processStackItem(initialGame: IGame) {
  let game = { ...initialGame }

  // the purpose of this function is to pop the top StackItem
  // and process the effect

  // effects can:
  // 1) mutate player and card objects
  // 2) update the game phase
  // 3) create more effects

  const stackItem = game.stack.pop()

  if (stackItem) {
    game = processEffectItem(game, stackItem.effectItem)
  }

  return game
}
