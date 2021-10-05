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
import { drawCard } from './utils'

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
      game.players.map((player) =>
        player.username === 'opponent' ? { ...player, life: player.life - 1 } : { ...player }
      )
      break
    case EffectType.DAMAGE_PLAYER:
      game.players.map((player) =>
        player.username === 'opponent' ? { ...player, life: player.life - 1 } : { ...player }
      )
      break
    default:
      throw new Error(`unhandled EffectType: ${effect.type}`)
  }

  return game
}

function processEffectCast(initialGame: IGame, effect: IEffect, cardId: string) {
  let game = { ...initialGame }

  const card = game.players
    .map((player) => player.cards)
    .flat()
    .find((card) => card.id === cardId)

  if (!card) {
    throw new Error(`no card found with id ${cardId} while handling Cast`)
  }

  switch (effect.type) {
    case EffectType.CAST:
      if (card.type === CardType.SPELL) {
        card.location = CardLocation.GRAVEYARD
        // how do we kick off spell effects?
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

  const playerWhoHasTurn = game.players.find((player) => player.id === game.hasTurn)
  if (!playerWhoHasTurn) {
    throw new Error('active player not found')
  }

  // eventually, we might want this function to kick off other effects
  // which update the game state. in any case, need to support effects
  // triggered by other effects

  if (game.phase === Phase.START) {
    // untap permanents
    playerWhoHasTurn.cards.forEach((card) => {
      if (card.location === CardLocation.BATTLEFIELD) {
        card.tapped = false
      }
    })

    // draw a card
    game = drawCard(game, playerWhoHasTurn.id)

    // reset mana to current turn count
    playerWhoHasTurn.mana = game.turn

    game.phase = Phase.MAIN
  } else if (game.phase === Phase.MAIN) {
    game.phase = Phase.COMBAT
  } else if (game.phase === Phase.COMBAT) {
    game.phase = Phase.END
  } else if (game.phase === Phase.END) {
    game.turn += 1
    // TODO pass turn to other player here
    game.phase = Phase.START
  }

  return game
}
