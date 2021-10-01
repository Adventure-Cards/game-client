import {
  IGame,
  Phase,
  IEffectItem,
  EffectType,
  IEffect,
  IPlayer,
  EffectItemType,
  CardLocation,
  CardType,
} from './types'

import { updateAvailableActionsForPlayers } from './actions'

export function processEffectItem(initialGame: IGame, effectItem: IEffectItem) {
  let game = { ...initialGame }

  const player = game.players.find((player) => player.id === effectItem.controllerId)
  if (!player) {
    throw new Error(`player with id ${effectItem.controllerId} not found`)
  }

  switch (effectItem.type) {
    case EffectItemType.CORE:
      game = processEffectCore(game, effectItem.effect, player)
      break
    case EffectItemType.CAST:
      game = processEffectCast(game, effectItem.effect, effectItem.cardId)
      break
    case EffectItemType.WITH_AMOUNT:
      game = processEffectWithAmount(game, effectItem.effect, effectItem.amount)
      break
    default:
      throw new Error(`unhandled EffectItemType: ${effectItem.type}`)
  }

  // after processing an effect, need to refresh the available actions
  // for each player, because the game state has changed
  game = updateAvailableActionsForPlayers(game)

  return game
}

function processEffectCore(initialGame: IGame, effect: IEffect, player: IPlayer) {
  let game = { ...initialGame }

  switch (effect.type) {
    case EffectType.MANA_ADD:
      player.manaPool[effect.color] += effect.amount
      break
    case EffectType.RELEASE_PRIORITY:
      game = advancePhase(game)
      break
    default:
      throw new Error(`unhandled EffectType: ${effect.type}`)
  }

  return game
}

function processEffectWithAmount(initialGame: IGame, effect: IEffect, amount: number) {
  let game = { ...initialGame }

  switch (effect.type) {
    case EffectType.DAMAGE_ANY:
      game.opponentLife -= amount
      break
    case EffectType.DAMAGE_PLAYER:
      game.opponentLife -= amount
      break
    default:
      throw new Error(`unhandled EffectType: ${effect.type}`)
  }

  return game
}

function processEffectCast(initialGame: IGame, effect: IEffect, cardId: string) {
  let game = { ...initialGame }

  const card = game.players
    .map((player) => player.deck)
    .flat()
    .find((card) => card.id === cardId)

  if (!card) {
    throw new Error(`no card found with id ${cardId} while handling Cast`)
  }

  switch (effect.type) {
    case EffectType.CAST:
      if (card.type === CardType.SPELL) {
        card.location = CardLocation.GRAVEYARD
        // how do we kick of spell effects?
        card.effects.forEach((effect) => {
          game = processEffectWithAmount(game, effect, 1)
        })
      } else {
        card.location = CardLocation.BATTLEFIELD
      }
      break
    default:
      throw new Error(`unhandled EffectType: ${effect.type}`)
  }

  return game
}

function advancePhase(initialGame: IGame) {
  let game = { ...initialGame }

  // eventually, we might want this function to kick off other effects
  // which update the game state. in any case, need to support effects
  // triggered by other effects

  if (game.phase === Phase.UNTAP) {
    // untap all permanents
    game.players
      .filter((player) => player.id === game.hasPriority)
      .map((player) => player.deck)
      .flat()
      .forEach((card) => (card.tapped = false))
    game.phase = Phase.DRAW
  } else if (game.phase === Phase.DRAW) {
    // draw a card
    if (game.players[0].deck.filter((card) => card.location === CardLocation.LIBRARY).length > 0) {
      game.players[0].deck.filter((card) => card.location === CardLocation.LIBRARY)[0].location =
        CardLocation.HAND
    }
    game.phase = Phase.MAIN
  } else if (game.phase === Phase.MAIN) {
    game.phase = Phase.COMBAT
  } else if (game.phase === Phase.COMBAT) {
    game.phase = Phase.END
  } else if (game.phase === Phase.END) {
    game.turn += 1
    // TODO pass turn to other player here
    game.phase = Phase.UNTAP
  }

  return game
}
