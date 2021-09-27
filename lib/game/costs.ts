import { Game, CostTarget, CostType, Cost, CostItem } from './types'

export function validateCostItem(game: Game, costItem: CostItem) {
  switch (costItem.target) {
    case CostTarget.PLAYER:
      return validateCostPlayer(game, costItem.playerId, costItem.cost)
    case CostTarget.CARD:
      return validateCostCard(game, costItem.cardId, costItem.cost)
    default:
      throw new Error(`unhandled CostTarget`)
  }
}

function validateCostPlayer(game: Game, playerId: string, cost: Cost) {
  const player = game.players.find((player) => player.id === playerId)
  if (!player) {
    throw new Error(`no player found with id ${playerId} while paying CostItem`)
  }

  switch (cost.type) {
    case CostType.MANA:
      if (player.manaPool[cost.color] < cost.amount) {
        return false
      }
      break
    default:
      throw new Error(`unhandled CostTarget`)
  }

  return true
}

function validateCostCard(game: Game, cardId: string, cost: Cost) {
  const card = game.players
    .map((player) => player.deck)
    .flat()
    .find((card) => card.id === cardId)

  if (!card) {
    throw new Error(`no card found with id ${cardId} while paying CostItem`)
  }

  switch (cost.type) {
    case CostType.TAP:
      if (card.tapped) {
        return false
      }
      break
    default:
      throw new Error(`unhandled CostTarget`)
  }

  return true
}

export function processCostItem(initialGame: Game, costItem: CostItem) {
  let game = { ...initialGame }

  switch (costItem.target) {
    case CostTarget.PLAYER:
      game = processCostPlayer(game, costItem.playerId, costItem.cost)
      break
    case CostTarget.CARD:
      game = processCostCard(game, costItem.cardId, costItem.cost)
      break
    default:
      throw new Error(`unhandled CostTarget`)
  }

  return game
}

function processCostPlayer(initialGame: Game, playerId: string, cost: Cost) {
  let game = { ...initialGame }

  const player = game.players.find((player) => player.id === playerId)
  if (!player) {
    throw new Error(`no player found with id ${playerId} while paying CostItem`)
  }

  switch (cost.type) {
    case CostType.MANA:
      player.manaPool[cost.color] -= cost.amount
      break
    default:
      throw new Error(`unhandled CostTarget`)
  }

  return game
}

function processCostCard(initialGame: Game, cardId: string, cost: Cost) {
  let game = { ...initialGame }

  const card = game.players
    .map((player) => player.deck)
    .flat()
    .find((card) => card.id === cardId)

  if (!card) {
    throw new Error(`no card found with id ${cardId} while paying CostItem`)
  }

  switch (cost.type) {
    case CostType.TAP:
      card.tapped = true
      break
    default:
      throw new Error(`unhandled CostTarget`)
  }

  return game
}
