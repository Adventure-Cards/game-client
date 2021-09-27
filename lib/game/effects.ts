import { Game, Effect, EffectType } from './types'

export function processEffect(initialGame: Game, controllerId: string, effect: Effect) {
  let game = { ...initialGame }

  switch (effect.type) {
    case EffectType.MANA_ADD:
      const player = game.players.find((player) => player.id === controllerId)
      if (player) {
        player.manaPool[effect.color] += effect.amount
      }

      break
    default:
      throw new Error(`unhandled effect type: ${effect.type}`)
  }

  return game
}
